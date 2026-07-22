/**
 * Centralized storage keys for all practice data
 */
export const STORAGE_KEYS = {
  ikigai: 'michi_ikigai',
  wabisabi: 'michi_wabisabi',
  ma: 'michi_ma',
  kaizen: 'michi_kaizen',
  shinrin: 'michi_shinrin',
  gaman: 'michi_gaman',
  hansei: 'michi_hansei',
  mononoaware: 'michi_mononoaware',
  oubaitori: 'michi_oubaitori',
};

/**
 * Get the storage key for a practice by its ID
 */
export function getStorageKey(practiceId) {
  return STORAGE_KEYS[practiceId] || `michi_${practiceId}`;
}
