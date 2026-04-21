import express from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import { validate } from '../middleware/validate.js';
import { requireAdminToken } from '../middleware/adminAuth.js';

const router = express.Router();

// Public route to verify admin token
router.post('/verify-token', express.json(), (req, res) => {
  const { token } = req.body;
  const adminToken = process.env.ADMIN_TOKEN || 'change-me';
  if (token === adminToken) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

// All routes below require the admin token in x-admin-token header
router.use(requireAdminToken);

// ==========================================
// STATS
// ==========================================
router.get('/stats', async (req, res, next) => {
  try {
    const [[{ stores }]] = await pool.query('SELECT COUNT(*) AS stores FROM medical_store');
    const [[{ medicines }]] = await pool.query('SELECT COUNT(*) AS medicines FROM medicine');
    const [[{ low_stock }]] = await pool.query('SELECT COUNT(*) AS low_stock FROM stock WHERE quantity < 10');
    
    // Recent stock updates
    const [recent] = await pool.query(`
      SELECT s.quantity, s.price, s.last_updated, m.medicine_name, ms.store_name
      FROM stock s
      JOIN medicine m ON m.medicine_id = s.medicine_id
      JOIN medical_store ms ON ms.store_id = s.store_id
      ORDER BY s.last_updated DESC LIMIT 5
    `);

    // Low stock items
    const [lowStockItems] = await pool.query(`
      SELECT s.quantity, m.medicine_name, ms.store_name
      FROM stock s
      JOIN medicine m ON m.medicine_id = s.medicine_id
      JOIN medical_store ms ON ms.store_id = s.store_id
      WHERE s.quantity < 10 AND s.quantity > 0
      ORDER BY s.quantity ASC LIMIT 10
    `);

    res.json({
      totals: { stores, medicines, low_stock },
      recent_updates: recent,
      low_stock_items: lowStockItems
    });
  } catch (e) {
    next(e);
  }
});

// ==========================================
// MEDICINES
// ==========================================
const medicineSchema = z.object({
  body: z.object({
    medicine_name: z.string().min(1),
    category: z.string().min(1),
    manufacturer: z.string().min(1)
  })
});

router.get('/medicines', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medicine ORDER BY medicine_name ASC LIMIT 500');
    res.json({ items: rows });
  } catch (e) { next(e); }
});

router.post('/medicines', express.json(), validate(medicineSchema), async (req, res, next) => {
  try {
    const { medicine_name, category, manufacturer } = req.validated.body;
    const [result] = await pool.query(
      'INSERT INTO medicine (medicine_name, category, manufacturer) VALUES (?, ?, ?)',
      [medicine_name, category, manufacturer]
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (e) { next(e); }
});

router.patch('/medicines/:id', express.json(), validate(medicineSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { medicine_name, category, manufacturer } = req.validated.body;
    await pool.query(
      'UPDATE medicine SET medicine_name=?, category=?, manufacturer=? WHERE medicine_id=?',
      [medicine_name, category, manufacturer, id]
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.delete('/medicines/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM medicine WHERE medicine_id=?', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ==========================================
// STORES
// ==========================================
const storeSchema = z.object({
  body: z.object({
    store_name: z.string().min(1),
    phone: z.string().nullable().optional(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    address: z.string().min(1),
    opening_hours: z.string().default('8:00 AM - 10:00 PM')
  })
});

router.get('/stores', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medical_store ORDER BY store_id ASC');
    res.json({ items: rows });
  } catch (e) { next(e); }
});

router.post('/stores', express.json(), validate(storeSchema), async (req, res, next) => {
  try {
    const { store_name, phone, latitude, longitude, address, opening_hours } = req.validated.body;
    const [result] = await pool.query(
      'INSERT INTO medical_store (store_name, phone, latitude, longitude, address, opening_hours) VALUES (?, ?, ?, ?, ?, ?)',
      [store_name, phone, latitude, longitude, address, opening_hours]
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (e) { next(e); }
});

router.patch('/stores/:id', express.json(), validate(storeSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { store_name, phone, latitude, longitude, address, opening_hours } = req.validated.body;
    await pool.query(
      'UPDATE medical_store SET store_name=?, phone=?, latitude=?, longitude=?, address=?, opening_hours=? WHERE store_id=?',
      [store_name, phone, latitude, longitude, address, opening_hours, id]
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.delete('/stores/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM medical_store WHERE store_id=?', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ==========================================
// STOCK
// ==========================================
const upsertStockSchema = z.object({
  body: z.object({
    store_id: z.coerce.number().int().positive(),
    medicine_id: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().min(0),
    price: z.coerce.number().min(0)
  })
});

router.get('/stock', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, m.medicine_name, ms.store_name 
      FROM stock s 
      JOIN medicine m ON m.medicine_id = s.medicine_id 
      JOIN medical_store ms ON ms.store_id = s.store_id 
      ORDER BY s.last_updated DESC 
      LIMIT 1000
    `);
    res.json({ items: rows });
  } catch (e) { next(e); }
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

router.delete('/stock/:store_id/:medicine_id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM stock WHERE store_id=? AND medicine_id=?', [Number(req.params.store_id), Number(req.params.medicine_id)]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
