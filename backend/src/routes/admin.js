import express from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import { validate } from '../middleware/validate.js';
import { requireAdminToken } from '../middleware/adminAuth.js';

const router = express.Router();

router.use(requireAdminToken);

// POST /admin/stock  { store_id, medicine_id, quantity, price }
// Upsert stock row (MVP).
const upsertStockSchema = z.object({
  body: z.object({
    store_id: z.coerce.number().int().positive(),
    medicine_id: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().min(0),
    price: z.coerce.number().min(0)
  })
});

router.post('/stock', express.json(), validate(upsertStockSchema), async (req, res, next) => {
  try {
    const { store_id, medicine_id, quantity, price } = req.validated.body;
    const sql = `
      INSERT INTO stock (store_id, medicine_id, quantity, price)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        quantity = VALUES(quantity),
        price = VALUES(price),
        last_updated = CURRENT_TIMESTAMP;
    `;
    await pool.query(sql, [store_id, medicine_id, quantity, price]);
    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;

