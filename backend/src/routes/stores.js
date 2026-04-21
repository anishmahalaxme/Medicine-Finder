import express from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// GET /stores/nearby?lat=&lng=&radius=
const nearbySchema = z.object({
  query: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    radius: z.coerce.number().default(5)
  })
});

router.get('/nearby', validate(nearbySchema), async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.validated.query;
    const radiusKm = Math.max(0.1, Number(radius));
    const latNum = Number(lat);
    const lngNum = Number(lng);

    const latDelta = radiusKm / 111.32;
    const lngDelta = radiusKm / (111.32 * Math.cos((latNum * Math.PI) / 180));

    const sql = `
      SELECT
        ms.store_id,
        ms.store_name,
        ms.phone,
        ms.address,
        ms.latitude,
        ms.longitude,
        (
          6371 * 2 * ASIN(
            SQRT(
              POWER(SIN(RADIANS(ms.latitude - ?) / 2), 2) +
              COS(RADIANS(?)) * COS(RADIANS(ms.latitude)) *
              POWER(SIN(RADIANS(ms.longitude - ?) / 2), 2)
            )
          )
        ) AS distance_km
      FROM medical_store ms
      WHERE
        ms.latitude BETWEEN ? AND ?
        AND ms.longitude BETWEEN ? AND ?
      HAVING distance_km <= ?
      ORDER BY distance_km ASC
      LIMIT 100;
    `;

    const params = [
      latNum, latNum, lngNum,
      latNum - latDelta, latNum + latDelta,
      lngNum - lngDelta, lngNum + lngDelta,
      radiusKm
    ];

    const [rows] = await pool.query(sql, params);
    res.set('Cache-Control', 'no-store');
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});

// GET /stores/:id
const storeSchema = z.object({
  params: z.object({
    id: z.coerce.number()
  })
});

router.get('/:id', validate(storeSchema), async (req, res, next) => {
  try {
    const storeId = Number(req.validated.params.id);
    
    // Get store details
    const [storeRows] = await pool.query(
      'SELECT * FROM medical_store WHERE store_id = ?',
      [storeId]
    );

    if (storeRows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Get store medicines
    const sqlMeds = `
      SELECT
        m.medicine_id,
        m.medicine_name,
        m.category,
        m.manufacturer,
        s.quantity,
        s.price,
        s.last_updated
      FROM stock s
      JOIN medicine m ON m.medicine_id = s.medicine_id
      WHERE s.store_id = ?
      ORDER BY m.medicine_name ASC
      LIMIT 1000;
    `;
    const [medicineRows] = await pool.query(sqlMeds, [storeId]);
    
    // Calculate simple stats
    const inStock = medicineRows.filter(m => m.quantity > 0).length;

    res.set('Cache-Control', 'no-store');
    res.json({
      store: storeRows[0],
      stats: {
        total_medicines: medicineRows.length,
        in_stock_count: inStock,
        out_of_stock_count: medicineRows.length - inStock
      },
      medicines: medicineRows
    });
  } catch (e) {
    next(e);
  }
});

export default router;

