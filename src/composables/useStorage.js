import { reactive, watch, computed, onUnmounted } from 'vue';
import { Capacitor } from '@capacitor/core';

/**
 * Global reactive store shared across all useStorage instances
 */
export const globalStore = reactive({});
let isInitialized = false;
let db = null;

const isNative = Capacitor.isNativePlatform();

async function initDatabase() {
  if (!isNative) return;

  const { CapacitorSQLite, SQLiteConnection } = await import('@capacitor-community/sqlite');
  const sqlite = new SQLiteConnection(CapacitorSQLite);

  db = await sqlite.createConnection('michi', false, 'no-encryption', 1, false);
  await db.open();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS store (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
}

/**
 * Initialize the storage system. Must be called before using useStorage.
 */
export async function initStore() {
  if (isInitialized) return;
  try {
    await initDatabase();
    if (db) {
      const result = await db.query('SELECT key, value FROM store');
      const rows = result.values || [];
      for (const row of rows) {
        try {
          globalStore[row.key] = JSON.parse(row.value);
        } catch {
          // skip malformed entries
        }
      }
    }
  } catch (e) {
    console.error("Failed to initialize SQLite", e);
  }
  isInitialized = true;
}

let timeoutIds = {};
function saveToBackend(key, value) {
  if (!db) return;
  if (timeoutIds[key]) clearTimeout(timeoutIds[key]);
  timeoutIds[key] = setTimeout(async () => {
    try {
      await db.run(
        'INSERT INTO store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, JSON.stringify(value)]
      );
    } catch (e) {
      console.error(`Failed to sync ${key} to SQLite`, e);
    }
  }, 500);
}

// Track active watchers for cleanup
const activeWatchers = new Map();

/**
 * Reactive storage composable with automatic localStorage and SQLite sync.
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {ComputedRef} Reactive computed ref for the stored value
 */
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

  // Clean up existing watcher for this key if any
  if (activeWatchers.has(key)) {
    activeWatchers.get(key)();
    activeWatchers.delete(key);
  }

  const stopWatcher = watch(() => globalStore[key], (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    saveToBackend(key, newValue);
  }, { deep: true });

  activeWatchers.set(key, stopWatcher);

  onUnmounted(() => {
    if (activeWatchers.has(key)) {
      activeWatchers.get(key)();
      activeWatchers.delete(key);
    }
  });

  return computed({
    get: () => globalStore[key],
    set: (v) => { globalStore[key] = v; }
  });
}

/**
 * Read a JSON value from storage without creating a reactive watcher.
 * @param {string} key - Storage key
 * @param {*} fallback - Fallback value if key doesn't exist
 * @returns {*} The stored value or fallback
 */
export function readJson(key, fallback) {
  if (key in globalStore) return globalStore[key];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Read an array property from a stored JSON object.
 * @param {string} key - Storage key
 * @param {string} arrayProp - Property name of the array
 * @returns {Array} The array or empty array
 */
export function safeReadArray(key, arrayProp) {
  const data = readJson(key, {});
  return data[arrayProp] || [];
}

/**
 * Remove a key from storage.
 * @param {string} key - Storage key to remove
 */
export function removeStorage(key) {
  delete globalStore[key];
  localStorage.removeItem(key);
  if (activeWatchers.has(key)) {
    activeWatchers.get(key)();
    activeWatchers.delete(key);
  }
}
