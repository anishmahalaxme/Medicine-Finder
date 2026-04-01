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

    // Bounding-box prefilter for performance; then precise Haversine in SQL.
    // 1 deg latitude ~ 111.32 km
    const radiusKm = hasGeo ? Math.max(0.1, Number(radius)) : null;
    const latNum = hasGeo ? Number(lat) : null;
    const lngNum = hasGeo ? Number(lng) : null;

    const latDelta = hasGeo ? radiusKm / 111.32 : null;
    const lngDelta = hasGeo ? radiusKm / (111.32 * Math.cos((latNum * Math.PI) / 180)) : null;

    const params = [];
    let whereStore = '';
    if (hasGeo) {
      whereStore = `
        AND ms.latitude BETWEEN ? AND ?
        AND ms.longitude BETWEEN ? AND ?
      `;
      params.push(latNum - latDelta, latNum + latDelta, lngNum - lngDelta, lngNum + lngDelta);
    }

    // Note: using LIKE for MVP. For scale: FULLTEXT index / search service.
    // Distance is returned when geo provided, else NULL.
    const sql = `
      SELECT
        m.medicine_id,
        m.medicine_name,
        m.category,
        m.manufacturer,
        ms.store_id,
        ms.store_name,
        ms.phone AS store_phone,
        ms.address,
        ms.latitude,
        ms.longitude,
        s.quantity,
        s.price,
        s.last_updated,
        ${
          hasGeo
            ? `(
                6371 * 2 * ASIN(
                  SQRT(
                    POWER(SIN(RADIANS(ms.latitude - ?) / 2), 2) +
                    COS(RADIANS(?)) * COS(RADIANS(ms.latitude)) *
                    POWER(SIN(RADIANS(ms.longitude - ?) / 2), 2)
                  )
                )
              )`
            : 'NULL'
        } AS distance_km
      FROM medicine m
      JOIN stock s ON s.medicine_id = m.medicine_id
      JOIN medical_store ms ON ms.store_id = s.store_id
      WHERE m.medicine_name LIKE ?
      ${whereStore}
      ${
        hasGeo
          ? 'HAVING distance_km <= ?'
          : ''
      }
      ORDER BY ${hasGeo ? 'distance_km ASC,' : ''} s.quantity > 0 DESC, s.last_updated DESC
      LIMIT 100;
    `;

    if (hasGeo) {
      // Haversine params come before LIKE because embedded in SELECT
      params.unshift(latNum, latNum, lngNum);
    }

    params.push(`%${name}%`);
    if (hasGeo) params.push(radiusKm);

    const [rows] = await pool.query(sql, params);
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});

export default router;

