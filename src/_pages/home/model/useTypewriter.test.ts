import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TerminalLine } from './typewriter';
import { useTypewriter } from './useTypewriter';

const script: TerminalLine[] = [{ command: true, text: 'ls', tone: 'text' }];

function mockReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: reduced, addEventListener: () => {}, removeEventListener: () => {} })),
  );
}

describe('useTypewriter', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('types one character per tick at the given speed', () => {
    mockReducedMotion(false);
    const { result } = renderHook(() => useTypewriter(script, 55));
    expect(result.current[0]?.text).toBe('');

    act(() => vi.advanceTimersByTime(55));
    expect(result.current[0]?.text).toBe('l');

    act(() => vi.advanceTimersByTime(55));
    expect(result.current[0]?.text).toBe('ls');
  });

  it('shows the whole script at once with reduced motion', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useTypewriter(script, 55));
    expect(result.current[0]?.text).toBe('ls');
  });

  it('stops its timer on unmount', () => {
    mockReducedMotion(false);
    const { unmount } = renderHook(() => useTypewriter(script, 55));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
