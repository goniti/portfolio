import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hasScrolledPast, useScrolledPastOnce } from './useScrolledPastOnce';

function scrollTo(scrollY: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY });
  window.dispatchEvent(new Event('scroll'));
}

describe('hasScrolledPast', () => {
  it('is true only beyond the threshold, like goniui BackToTop', () => {
    expect(hasScrolledPast(810, 900, 0.9)).toBe(false);
    expect(hasScrolledPast(811, 900, 0.9)).toBe(true);
  });
});

describe('useScrolledPastOnce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });
    scrollTo(0);
  });
  afterEach(() => {
    vi.useRealTimers();
    scrollTo(0);
  });

  it('turns true past the threshold and stays true when scrolling back up', () => {
    const { result } = renderHook(() => useScrolledPastOnce(0.9));
    act(() => vi.advanceTimersToNextFrame());
    expect(result.current).toBe(false);

    act(() => {
      scrollTo(820);
      vi.advanceTimersToNextFrame();
    });
    expect(result.current).toBe(true);

    act(() => {
      scrollTo(0);
      vi.advanceTimersToNextFrame();
    });
    expect(result.current).toBe(true);
  });

  it('is true right away when the page opens already past the threshold', () => {
    scrollTo(2000);
    const { result } = renderHook(() => useScrolledPastOnce(0.9));

    act(() => vi.advanceTimersToNextFrame());

    expect(result.current).toBe(true);
  });
});
