import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import medicinesRouter from './routes/medicines.js';
import storesRouter from './routes/stores.js';
import adminRouter from './routes/admin.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) ?? '*'
  })
);

app.get('/health', (req, res) => res.json({ ok: true }));

// Prevent browser from caching API responses (avoids stale 304s)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/medicines', medicinesRouter);
app.use('/stores', storesRouter);
app.use('/admin', adminRouter);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const code = err?.code;
  if (code === 'ER_ACCESS_DENIED_ERROR' || code === 'ECONNREFUSED' || code === 'ER_BAD_DB_ERROR') {
    return res.status(503).json({
      error: 'DATABASE_UNAVAILABLE',
      message: 'Database connection failed. Check backend/.env DB_* settings and ensure schema is loaded.'
    });
  }
  res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

