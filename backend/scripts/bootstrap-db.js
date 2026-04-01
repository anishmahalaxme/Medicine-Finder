import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'online_medical_store_finder',
  DB_USER = 'omf_app',
  DB_PASSWORD = 'omf_app_password',
  DB_ROOT_USER = 'root',
  DB_ROOT_PASSWORD
} = process.env;

if (!DB_ROOT_PASSWORD) {
  console.error(
    'Missing DB_ROOT_PASSWORD. Set it in backend/.env (or as an environment variable) to bootstrap the database.'
  );
  process.exit(1);
}

async function runSqlFile(conn, filePath) {
  const sql = await fs.readFile(filePath, 'utf8');
  const statements = sql
    .split(/;\s*(?:\r?\n|$)/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    // Some files contain leading comments; ensure we execute the full statement.
    await conn.query(stmt);
  }
}

async function main() {
  const port = Number(DB_PORT);

  const admin = await mysql.createConnection({
    host: DB_HOST,
    port,
    user: DB_ROOT_USER,
    password: DB_ROOT_PASSWORD,
    multipleStatements: true
  });

  try {
    await admin.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`);
    await admin.query(
      `CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD.replace(/'/g, "\\'")}';`
    );
    await admin.query(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';`);
    await admin.query('FLUSH PRIVILEGES;');

    const appConn = await mysql.createConnection({
      host: DB_HOST,
      port,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true
    });

    try {
      const repoRoot = path.resolve(__dirname, '..', '..');
      const schemaPath = path.join(repoRoot, 'db', 'schema.sql');
      const seedPath = path.join(repoRoot, 'db', 'seed.sql');

      await runSqlFile(appConn, schemaPath);
      await runSqlFile(appConn, seedPath);
    } finally {
      await appConn.end();
    }

    console.log('DB bootstrap complete.');
    console.log(`Database: ${DB_NAME}`);
    console.log(`App user: ${DB_USER}`);
  } finally {
    await admin.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

