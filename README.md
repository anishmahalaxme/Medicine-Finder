# Online Medical Store Finder (MVP)

This repo contains a **minimal, extendable MVP**:

- `backend/`: Node.js + Express API (MySQL-ready)
- `frontend/`: React website (search + nearby stores)
- `db/`: SQL schema + seed data

## Prereqs

- Node.js 18+ (recommended 20+)
- MySQL 8.0+

## 1) Database

Create a database and load schema + seed:

```sql
SOURCE db/schema.sql;
SOURCE db/seed.sql;
```

## 2) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:4000`.

## 3) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## MVP Features implemented

- Search medicine and show stores with price/quantity + distance
- Nearby stores within radius (km)
- Basic admin endpoint to upsert stock (minimal RBAC stub)

## Next steps (when you’re ready)

- Proper auth (JWT), full RBAC, audit logs
- Background jobs (low-stock alerts, notifications)
- Pagination, caching, full-text search, spatial indexes

