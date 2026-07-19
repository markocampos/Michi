import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getToday, formatDate, isSameDay, getWeekdayLabel } from '../dates.js';

describe('dates utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-19T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('getToday returns the current date as YYYY-MM-DD', () => {
    expect(getToday()).toBe('2026-07-19');
  });

  it('formatDate formats correctly', () => {
    const formatted = formatDate('2026-07-19');
    expect(formatted).toBe('Jul 19, 2026');
  });

  it('isSameDay correctly identifies same days', () => {
    expect(isSameDay('2026-07-19', '2026-07-19')).toBe(true);
    expect(isSameDay('2026-07-19', '2026-07-20')).toBe(false);
  });

  it('getWeekdayLabel returns narrow weekday', () => {
    // 2026-07-19 is a Sunday
    expect(getWeekdayLabel('2026-07-19')).toBe('S');
  });
});
