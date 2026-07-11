import { reactive, watch, computed } from 'vue';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

export const globalStore = reactive({});
let isInitialized = false;
let db = null;

const isNative = Capacitor.isNativePlatform();

async function initDatabase() {
  const sqlite = new SQLiteConnection(CapacitorSQLite);

  if (!isNative) {
    await sqlite.initWebStore();
  }

  db = await sqlite.createConnection('michi', false, 'no-encryption', 1, false);
  await db.open();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS store (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
}

export async function initStore() {
  if (isInitialized) return;
  try {
    await initDatabase();
    const result = await db.query('SELECT key, value FROM store');
    const rows = result.values || [];
    for (const row of rows) {
      try {
        globalStore[row.key] = JSON.parse(row.value);
      } catch {
        // skip malformed entries
      }
    }
  } catch (e) {
    console.error("Failed to initialize SQLite", e);
  }
  isInitialized = true;
}

let timeoutIds = {};
function saveToBackend(key, value) {
  if (timeoutIds[key]) clearTimeout(timeoutIds[key]);
  timeoutIds[key] = setTimeout(async () => {
    try {
      if (!db) return;
      await db.run(
        'INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, JSON.stringify(value)]
      );
    } catch (e) {
      console.error(`Failed to sync ${key} to SQLite`, e);
    }
  }, 500);
}

export function useStorage(key, defaultValue) {
  if (!(key in globalStore)) {
    try {
      const raw = localStorage.getItem(key);
      globalStore[key] = raw ? JSON.parse(raw) : defaultValue;
    } catch {
      globalStore[key] = defaultValue;
    }
    saveToBackend(key, globalStore[key]);
  }

  watch(() => globalStore[key], (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    saveToBackend(key, newValue);
  }, { deep: true });

  return computed({
    get: () => globalStore[key],
    set: (v) => { globalStore[key] = v; }
  });
}

export function readJson(key, fallback) {
  if (key in globalStore) return globalStore[key];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function safeReadArray(key, arrayProp) {
  const data = readJson(key, {});
  return data[arrayProp] || [];
}
