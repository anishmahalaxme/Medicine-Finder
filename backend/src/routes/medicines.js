import express from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// GET /medicines/search?name=&lat=&lng=&radius=
// If lat/lng/radius provided, returns stores with distance and availability for that medicine search.
const searchSchema = z.object({
  query: z.object({
    name: z.string().trim().min(1),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radius: z.coerce.number().optional()
  })
});

router.get('/search', validate(searchSchema), async (req, res, next) => {
  try {
    const { name, lat, lng, radius } = req.validated.query;
    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(radius);

    const params = [];

    let sql;

    if (!hasGeo) {
      // No geo — simple name search across all stores
      sql = `
        SELECT
          m.medicine_id, m.medicine_name, m.category, m.manufacturer,
          ms.store_id, ms.store_name, ms.phone AS store_phone,
          ms.address, ms.latitude, ms.longitude,
          s.quantity, s.price, s.last_updated,
          NULL AS distance_km
        FROM medicine m
        JOIN stock s  ON s.medicine_id = m.medicine_id
        JOIN medical_store ms ON ms.store_id = s.store_id
        WHERE m.medicine_name LIKE ?
        ORDER BY s.quantity > 0 DESC, s.last_updated DESC
        LIMIT 100;
      `;
      params.push(`%${name}%`);
    } else {
      const radiusKm = Math.max(0.1, Number(radius));
      const latNum   = Number(lat);
      const lngNum   = Number(lng);
      const latDelta = radiusKm / 111.32;
      const lngDelta = radiusKm / (111.32 * Math.cos((latNum * Math.PI) / 180));

      // Subquery approach: compute distance in inner query, filter in outer query.
      // This avoids MySQL 8's restriction on referencing source columns in HAVING.
      sql = `
        SELECT *
        FROM (
          SELECT
            m.medicine_id, m.medicine_name, m.category, m.manufacturer,
            ms.store_id, ms.store_name, ms.phone AS store_phone,
            ms.address, ms.latitude, ms.longitude,
            s.quantity, s.price, s.last_updated,
            (
              6371 * 2 * ASIN(SQRT(
                POWER(SIN(RADIANS(ms.latitude  - ?) / 2), 2) +
                COS(RADIANS(?)) * COS(RADIANS(ms.latitude)) *
                POWER(SIN(RADIANS(ms.longitude - ?) / 2), 2)
              ))
            ) AS distance_km
          FROM medicine m
          JOIN stock s  ON s.medicine_id = m.medicine_id
          JOIN medical_store ms ON ms.store_id = s.store_id
          WHERE m.medicine_name LIKE ?
            AND ms.latitude  BETWEEN ? AND ?
            AND ms.longitude BETWEEN ? AND ?
        ) AS sub
        WHERE sub.distance_km <= ?
        ORDER BY sub.distance_km ASC, sub.quantity > 0 DESC, sub.last_updated DESC
        LIMIT 100;
      `;
      params.push(
        latNum, latNum, lngNum,          // Haversine in SELECT
        `%${name}%`,                     // WHERE name LIKE
        latNum - latDelta, latNum + latDelta,   // bbox lat
        lngNum - lngDelta, lngNum + lngDelta,   // bbox lng
        radiusKm                         // outer WHERE distance_km <=
      );
    }

    const [rows] = await pool.query(sql, params);
    res.set('Cache-Control', 'no-store');
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});


// GET /medicines/all — returns all medicine names for autocomplete
router.get('/all', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT medicine_id, medicine_name, category FROM medicine ORDER BY medicine_name ASC'
    );
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});

// GET /medicines/categories
router.get('/categories', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT category, COUNT(*) AS medicine_count FROM medicine GROUP BY category ORDER BY medicine_count DESC'
    );
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});

const alternativesSchema = z.object({
  query: z.object({
    category: z.string().min(1),
    exclude_id: z.coerce.number().positive(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radius: z.coerce.number().optional()
  })
});

// GET /medicines/alternatives
router.get('/alternatives', validate(alternativesSchema), async (req, res, next) => {
  try {
    const { category, exclude_id, lat, lng, radius } = req.validated.query;
    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(radius);

    let sql;
    const params = [];

    if (!hasGeo) {
      sql = `
        SELECT m.medicine_id, m.medicine_name, m.category, m.manufacturer,
               ms.store_id, ms.store_name, s.quantity, s.price
        FROM medicine m
        JOIN stock s ON s.medicine_id = m.medicine_id
        JOIN medical_store ms ON ms.store_id = s.store_id
        WHERE m.category = ? AND m.medicine_id != ? AND s.quantity > 0
        ORDER BY s.quantity > 0 DESC, s.last_updated DESC
        LIMIT 5;
      `;
      params.push(category, exclude_id);
    } else {
      const radiusKm = Math.max(0.1, Number(radius));
      const latNum = Number(lat);
      const lngNum = Number(lng);
      const latDelta = radiusKm / 111.32;
      const lngDelta = radiusKm / (111.32 * Math.cos((latNum * Math.PI) / 180));

      sql = `
        SELECT * FROM (
          SELECT m.medicine_id, m.medicine_name, m.category, m.manufacturer,
                 ms.store_id, ms.store_name, s.quantity, s.price,
                 (6371 * 2 * ASIN(SQRT(
                   POWER(SIN(RADIANS(ms.latitude - ?) / 2), 2) +
                   COS(RADIANS(?)) * COS(RADIANS(ms.latitude)) *
                   POWER(SIN(RADIANS(ms.longitude - ?) / 2), 2)
                 ))) AS distance_km
          FROM medicine m
          JOIN stock s ON s.medicine_id = m.medicine_id
          JOIN medical_store ms ON ms.store_id = s.store_id
          WHERE m.category = ? AND m.medicine_id != ? AND s.quantity > 0
            AND ms.latitude BETWEEN ? AND ?
            AND ms.longitude BETWEEN ? AND ?
        ) AS sub
        WHERE sub.distance_km <= ?
        ORDER BY sub.distance_km ASC, sub.quantity > 0 DESC
        LIMIT 5;
      `;
      params.push(
        latNum, latNum, lngNum,
        category, exclude_id,
        latNum - latDelta, latNum + latDelta,
        lngNum - lngDelta, lngNum + lngDelta,
        radiusKm
      );
    }
    const [rows] = await pool.query(sql, params);
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});

const searchCartSchema = z.object({
  query: z.object({
    names: z.string().min(1),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    radius: z.coerce.number().optional()
  })
});

// GET /medicines/search-cart
router.get('/search-cart', validate(searchCartSchema), async (req, res, next) => {
  try {
    const { names, lat, lng, radius } = req.validated.query;
    const nameList = names.split(',').map(n => n.trim()).filter(n => n.length > 0);
    
    if (nameList.length === 0) {
      return res.json({ items: [] });
    }

    const hasGeo = Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(radius);
    const radiusKm = hasGeo ? Math.max(0.1, Number(radius)) : null;
    const latNum = hasGeo ? Number(lat) : null;
    const lngNum = hasGeo ? Number(lng) : null;
    const latDelta = hasGeo ? radiusKm / 111.32 : null;
    const lngDelta = hasGeo ? radiusKm / (111.32 * Math.cos((latNum * Math.PI) / 180)) : null;

    const nameConditions = nameList.map(() => 'm.medicine_name LIKE ?').join(' OR ');
    const nameParams = nameList.map(n => `%${n}%`);

    let sql;
    const params = [];

    if (!hasGeo) {
      sql = `
        SELECT ms.store_id, ms.store_name, ms.address, ms.phone, NULL AS distance_km,
               m.medicine_id, m.medicine_name, s.quantity, s.price
        FROM medical_store ms
        JOIN stock s ON ms.store_id = s.store_id
        JOIN medicine m ON m.medicine_id = s.medicine_id
        WHERE (${nameConditions}) AND s.quantity > 0
      `;
      params.push(...nameParams);
    } else {
      sql = `
        SELECT ms.store_id, ms.store_name, ms.address, ms.phone,
               m.medicine_id, m.medicine_name, s.quantity, s.price,
               (6371 * 2 * ASIN(SQRT(
                   POWER(SIN(RADIANS(ms.latitude - ?) / 2), 2) +
                   COS(RADIANS(?)) * COS(RADIANS(ms.latitude)) *
                   POWER(SIN(RADIANS(ms.longitude - ?) / 2), 2)
               ))) AS distance_km
        FROM medical_store ms
        JOIN stock s ON ms.store_id = s.store_id
        JOIN medicine m ON m.medicine_id = s.medicine_id
        WHERE (${nameConditions}) AND s.quantity > 0
          AND ms.latitude BETWEEN ? AND ?
          AND ms.longitude BETWEEN ? AND ?
      `;
      params.push(latNum, latNum, lngNum, ...nameParams, latNum - latDelta, latNum + latDelta, lngNum - lngDelta, lngNum + lngDelta);
    }

    const [rows] = await pool.query(sql, params);
    const validRows = hasGeo ? rows.filter(r => r.distance_km <= radiusKm) : rows;

    const storesMap = {};
    for (const r of validRows) {
      if (!storesMap[r.store_id]) {
        storesMap[r.store_id] = {
          store_id: r.store_id,
          store_name: r.store_name,
          address: r.address,
          phone: r.phone,
          distance_km: r.distance_km,
          matched_medicines: [],
          match_count: 0
        };
      }
      storesMap[r.store_id].matched_medicines.push({
        medicine_id: r.medicine_id,
        medicine_name: r.medicine_name,
        quantity: r.quantity,
        price: r.price
      });
      storesMap[r.store_id].match_count += 1;
    }

    const items = Object.values(storesMap).sort((a, b) => {
      if (a.match_count !== b.match_count) return b.match_count - a.match_count;
      return (a.distance_km || 0) - (b.distance_km || 0);
    });

    res.set('Cache-Control', 'no-store');
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

export default router;

