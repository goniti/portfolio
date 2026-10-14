import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NEAR_VIEWPORT_MARGIN, useNearViewport } from './useNearViewport';

type IntersectionCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

interface ObserverRecord {
  options: IntersectionObserverInit | undefined;
  observed: Element[];
  disconnections: number;
  notify: IntersectionCallback;
}

/** Records what the hook observes and lets the test report an intersection. */
function stubIntersectionObserver() {
  const record: ObserverRecord = {
    options: undefined,
    observed: [],
    disconnections: 0,
    notify: () => {},
  };
  class FakeIntersectionObserver {
    constructor(callback: IntersectionCallback, options?: IntersectionObserverInit) {
      record.notify = callback;
      record.options = options;
    }
    observe(element: Element) {
      record.observed.push(element);
    }
    disconnect() {
      record.disconnections += 1;
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  return record;
}

describe('useNearViewport', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('waits for the element to come near, then stays near and stops watching', () => {
    const observer = stubIntersectionObserver();
    const target = document.createElement('div');
    const { result } = renderHook(() => useNearViewport<HTMLDivElement>());

    act(() => result.current.ref(target));
    expect(result.current.isNear).toBe(false);
    expect(observer.observed).toEqual([target]);
    expect(observer.options?.rootMargin).toBe(NEAR_VIEWPORT_MARGIN);

    act(() => observer.notify([{ isIntersecting: false }]));
    expect(result.current.isNear).toBe(false);

    act(() => observer.notify([{ isIntersecting: true }]));
    expect(result.current.isNear).toBe(true);
    expect(observer.disconnections).toBeGreaterThan(0);
  });

  it('passes a custom reach to the observer', () => {
    const observer = stubIntersectionObserver();
    const { result } = renderHook(() => useNearViewport({ rootMargin: '50% 0px' }));

    act(() => result.current.ref(document.createElement('div')));

    expect(observer.options?.rootMargin).toBe('50% 0px');
  });

  it('reports near straight away without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { result } = renderHook(() => useNearViewport());

    act(() => result.current.ref(document.createElement('div')));

    expect(result.current.isNear).toBe(true);
  });
});
