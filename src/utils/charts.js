import { getLastNDays, getWeekdayLabel } from './dates.js';

/**
 * Get practice counts per day for the last N days
 */
export function getDailyPracticeCounts(data, days = 7) {
  const dates = getLastNDays(days);
  return dates.map(date => {
    let count = 0;
    if (data.kaizen?.habits?.some(h => h.completedDates?.includes(date))) count++;
    if (data.gaman?.challenges?.some(c => c.completedDates?.includes(date))) count++;
    if (data.wabisabi?.entries?.some(e => e.date === date)) count++;
    if (data.mononoaware?.entries?.some(e => e.date === date)) count++;
    if (data.shinrin?.walks?.some(w => w.date === date)) count++;
    if (data.ma?.sessions?.some(s => s.date === date)) count++;
    if (data.ikigai?.reflections?.some(r => r.date === date)) count++;
    if (data.hansei?.reflections?.some(r => r.date === date)) count++;
    return { date, count, label: getWeekdayLabel(date) };
  });
}

/**
 * Get meditation minutes per day for the last N days
 */
export function getMeditationMinutes(data, days = 30) {
  const dates = getLastNDays(days);
  return dates.map(date => {
    const sessions = data.ma?.sessions?.filter(s => s.date === date) || [];
    const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    return {
      date,
      minutes: totalSeconds > 0 ? Math.max(1, Math.round(totalSeconds / 60)) : 0,
    };
  });
}

/**
 * Get practice type distribution (total counts)
 */
export function getPracticeDistribution(data) {
  return [
    { name: 'Ma', jp: '間', count: data.ma?.sessions?.length || 0, color: 'var(--color-forest)' },
    { name: 'Shinrin-yoku', jp: '森林浴', count: data.shinrin?.walks?.length || 0, color: 'var(--color-summer)' },
    { name: 'Wabi-sabi', jp: '侘寂', count: data.wabisabi?.entries?.length || 0, color: 'var(--color-earth)' },
    { name: 'Ikigai', jp: '生きがい', count: data.ikigai?.reflections?.length || 0, color: 'var(--color-torii)' },
    { name: 'Hansei', jp: '反省', count: data.hansei?.reflections?.length || 0, color: 'var(--color-earth-dark)' },
    { name: 'Mono no aware', jp: '物の哀れ', count: data.mononoaware?.entries?.length || 0, color: 'var(--color-spring)' },
  ].filter(p => p.count > 0);
}

/**
 * Calculate monthly comparison (this month vs last month)
 */
export function getMonthlyComparison(data) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  function isInMonth(dateStr, month, year) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getMonth() === month && d.getFullYear() === year;
  }

  function countInMonth(arr, dateProp, month, year) {
    return (arr || []).filter(item => isInMonth(item[dateProp] || item.date, month, year)).length;
  }

  const thisMonthCount =
    countInMonth(data.ma?.sessions, 'date', thisMonth, thisYear) +
    countInMonth(data.shinrin?.walks, 'date', thisMonth, thisYear) +
    countInMonth(data.wabisabi?.entries, 'date', thisMonth, thisYear) +
    countInMonth(data.ikigai?.reflections, 'date', thisMonth, thisYear) +
    countInMonth(data.hansei?.reflections, 'date', thisMonth, thisYear) +
    countInMonth(data.mononoaware?.entries, 'date', thisMonth, thisYear);

  const lastMonthCount =
    countInMonth(data.ma?.sessions, 'date', lastMonth, lastMonthYear) +
    countInMonth(data.shinrin?.walks, 'date', lastMonth, lastMonthYear) +
    countInMonth(data.wabisabi?.entries, 'date', lastMonth, lastMonthYear) +
    countInMonth(data.ikigai?.reflections, 'date', lastMonth, lastMonthYear) +
    countInMonth(data.hansei?.reflections, 'date', lastMonth, lastMonthYear) +
    countInMonth(data.mononoaware?.entries, 'date', lastMonth, lastMonthYear);

  return { thisMonth: thisMonthCount, lastMonth: lastMonthCount };
}
