/**
 * PIN hashing helpers.
 *
 * The PIN protects the journal from casual snooping on the device, so a
 * salted SHA-256 hash is stored instead of the raw 4-digit PIN. This is
 * obfuscation, not real encryption — anyone with full device access can
 * still brute-force 10,000 combinations — but the raw PIN is no longer
 * readable in plain text from localStorage.
 */

const PIN_KEY = 'michi_pin';
const PIN_SALT = 'michi:pin:v1:';

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Dev-only fallback for non-secure contexts (e.g. vite dev server accessed
 * over LAN http://), where crypto.subtle is unavailable. NOT collision-safe
 * against an attacker — only used when Web Crypto can't be.
 */
function cyrb53Hex(text) {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

/**
 * Hash a 4-digit PIN with the app salt.
 * @param {string} pin
 * @returns {Promise<string>} hex hash
 */
export async function hashPin(pin) {
  const salted = PIN_SALT + pin;
  if (crypto?.subtle) {
    return sha256Hex(salted);
  }
  console.warn('Web Crypto unavailable (non-secure context) — using fallback PIN hash');
  return cyrb53Hex(salted);
}

/**
 * Read the stored PIN hash. Migrates legacy plaintext PINs (a bare 4-digit
 * string from older app versions) to a hash in place.
 * @returns {Promise<string>} the stored hash, or '' if no PIN is set
 */
export async function readPinHash() {
  const raw = localStorage.getItem(PIN_KEY);
  if (!raw) return '';
  if (/^\d{4}$/.test(raw)) {
    const hash = await hashPin(raw);
    localStorage.setItem(PIN_KEY, hash);
    return hash;
  }
  return raw;
}

/**
 * Verify a PIN attempt against the stored hash.
 * @param {string} pin - the PIN attempt
 * @param {string} storedHash - hash from readPinHash()
 * @returns {Promise<boolean>}
 */
export async function verifyPin(pin, storedHash) {
  if (!storedHash) return false;
  return (await hashPin(pin)) === storedHash;
}

/**
 * Hash and store a new PIN.
 * @param {string} pin
 * @returns {Promise<string>} the stored hash
 */
export async function writePin(pin) {
  const hash = await hashPin(pin);
  localStorage.setItem(PIN_KEY, hash);
  return hash;
}
