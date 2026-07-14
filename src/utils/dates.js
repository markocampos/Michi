/**
 * Get today's date as YYYY-MM-DD string
 */
export function getToday() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr, options = {}) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options,
    });
  } catch {
    return dateStr;
  }
}

/**
 * Check if two date strings are the same day
 */
export function isSameDay(dateStr1, dateStr2) {
  return dateStr1 === dateStr2;
}

/**
 * Get an array of date strings for the last N days
 */
export function getLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

/**
 * Get weekday label (narrow format like M, T, W)
 */
export function getWeekdayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en', { weekday: 'narrow' });
}
