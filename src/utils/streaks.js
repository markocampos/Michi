import { safeReadArray } from '../composables/useStorage.js';
import { STORAGE_KEYS } from './storage-keys.js';
import { getToday } from './dates.js';

/**
 * Check if a specific date has any practice completed
 */
export function isDayComplete(date, kaizenData, gamanData) {
  if (kaizenData?.habits?.some(h => h.completedDates?.includes(date))) return true;
  if (gamanData?.challenges?.some(c => c.completedDates?.includes(date))) return true;
  if (safeReadArray(STORAGE_KEYS.wabisabi, 'entries').some(e => e.date === date)) return true;
  if (safeReadArray(STORAGE_KEYS.mononoaware, 'entries').some(e => e.date === date)) return true;
  if (safeReadArray(STORAGE_KEYS.shinrin, 'walks').some(w => w.date === date)) return true;
  if (safeReadArray(STORAGE_KEYS.ma, 'sessions').some(s => s.date === date)) return true;
  if (safeReadArray(STORAGE_KEYS.ikigai, 'reflections').some(r => r.date === date)) return true;
  if (safeReadArray(STORAGE_KEYS.hansei, 'reflections').some(r => r.date === date)) return true;
  return false;
}

/**
 * Calculate the current streak of consecutive days with at least one practice
 */
export function calculateStreak(kaizenData, gamanData) {
  let count = 0;
  let date = new Date();
  for (let i = 0; i < 400; i++) {
    const d = date.toISOString().split('T')[0];
    if (isDayComplete(d, kaizenData, gamanData)) {
      count++;
    } else if (i > 0) {
      break;
    }
    date.setDate(date.getDate() - 1);
  }
  return count;
}

/**
 * Count completed practices for today
 */
export function countTodayPractices(kaizenData, gamanData) {
  const today = getToday();
  let count = 0;
  if (kaizenData?.habits?.some(h => h.completedDates?.includes(today))) count++;
  if (gamanData?.challenges?.some(c => c.completedDates?.includes(today))) count++;
  if (safeReadArray(STORAGE_KEYS.wabisabi, 'entries').some(e => e.date === today)) count++;
  if (safeReadArray(STORAGE_KEYS.mononoaware, 'entries').some(e => e.date === today)) count++;
  if (safeReadArray(STORAGE_KEYS.shinrin, 'walks').some(w => w.date === today)) count++;
  if (safeReadArray(STORAGE_KEYS.ma, 'sessions').some(s => s.date === today)) count++;
  if (safeReadArray(STORAGE_KEYS.ikigai, 'reflections').some(r => r.date === today)) count++;
  if (safeReadArray(STORAGE_KEYS.hansei, 'reflections').some(r => r.date === today)) count++;
  return count;
}

/**
 * Calculate streak for a single habit
 */
export function getHabitStreak(habit) {
  let streak = 0;
  let date = new Date();
  while (habit.completedDates?.includes(date.toISOString().split('T')[0])) {
    streak++;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}
