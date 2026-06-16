import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runSetup() {
  const sql = fs.readFileSync(path.join(__dirname, 'src/setup.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('Database setup completed successfully.');
  } catch (err) {
    console.error('Error running setup:', err);
  } finally {
    await pool.end();
  }
}

runSetup();
