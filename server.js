import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let db;

async function initDB() {
  db = await open({
    filename: join(dataDir, 'michi.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS store (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
}

app.get('/api/data', async (req, res) => {
  try {
    const rows = await db.all('SELECT key, value FROM store');
    const data = {};
    for (const row of rows) {
      try {
        data[row.key] = JSON.parse(row.value);
      } catch (e) {
        console.error(`Error parsing JSON for key ${row.key}`);
      }
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/data/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const value = JSON.stringify(req.body);
    
    await db.run(`
      INSERT INTO store (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `, [key, value]);
    
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3000;
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Michi API server running on http://0.0.0.0:${PORT}`);
  });
}).catch(console.error);
