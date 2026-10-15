import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

type ChangeListener = () => void;

function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<ChangeListener>();
  const state = { matches: initialMatches };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return state.matches;
      },
      addEventListener: (_type: string, listener: ChangeListener) => listeners.add(listener),
      removeEventListener: (_type: string, listener: ChangeListener) => listeners.delete(listener),
    })),
  );
  return {
    change(nextMatches: boolean) {
      state.matches = nextMatches;
      for (const listener of listeners) listener();
    },
    listenerCount: () => listeners.size,
  };
}

describe('useMediaQuery', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('follows the media query result', () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(pointer: fine)'));
    expect(result.current).toBe(false);

    act(() => media.change(true));
    expect(result.current).toBe(true);
  });

  it('unsubscribes on unmount', () => {
    const media = mockMatchMedia(true);
    const { unmount } = renderHook(() => useMediaQuery('(pointer: fine)'));
    expect(media.listenerCount()).toBe(1);
    unmount();
    expect(media.listenerCount()).toBe(0);
  });
});
