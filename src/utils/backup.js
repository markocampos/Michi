import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { STORAGE_KEYS } from './storage-keys.js';

/**
 * Automatically creates a backup in the phone's public Documents directory
 * so it survives app uninstalls.
 */
export async function createAutoBackup() {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    const data = {};
    for (const key of Object.values(STORAGE_KEYS)) {
      const raw = localStorage.getItem(key);
      if (raw) data[key] = JSON.parse(raw);
    }
    const jsonStr = JSON.stringify(data, null, 2);
    
    await Filesystem.writeFile({
      path: 'MichiBackup.json',
      data: jsonStr,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    console.log('Auto-backup saved to Documents/MichiBackup.json');
  } catch (e) {
    console.error('Failed to auto-backup to filesystem:', e);
  }
}

/**
 * Attempts to restore data from the MichiBackup.json in the Documents folder
 */
export async function restoreAutoBackup() {
  if (!Capacitor.isNativePlatform()) return false;
  
  try {
    const contents = await Filesystem.readFile({
      path: 'MichiBackup.json',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    
    const data = JSON.parse(contents.data);
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  } catch (e) {
    console.error('Failed to restore auto-backup from filesystem:', e);
    return false;
  }
}
