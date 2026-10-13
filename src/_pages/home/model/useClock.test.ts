import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatClock, useClock } from './useClock';

describe('formatClock', () => {
  it('formats the time in the requested zone', () => {
    const summerNoonUtc = new Date('2026-07-01T12:00:05Z');
    expect(formatClock(summerNoonUtc, 'Europe/Paris')).toBe('14:00:05');
  });
});

describe('useClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T08:30:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('ticks every second', () => {
    const { result } = renderHook(() => useClock('Europe/Paris'));
    expect(result.current).toBe('09:30:00');
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe('09:30:01');
  });
});
