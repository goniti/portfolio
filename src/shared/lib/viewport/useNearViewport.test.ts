import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { stubIntersectionObserver } from '../testing';
import { NEAR_VIEWPORT_MARGIN, useNearViewport } from './useNearViewport';

describe('useNearViewport', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('waits for the element to come near, then stays near and stops watching', () => {
    const observers = stubIntersectionObserver();
    const target = document.createElement('div');
    const { result } = renderHook(() => useNearViewport<HTMLDivElement>());

    act(() => result.current.ref(target));
    expect(result.current.isNear).toBe(false);
    const observer = observers.find(NEAR_VIEWPORT_MARGIN);
    expect([...observer.observed]).toEqual([target]);

    act(() => observer.fire(false));
    expect(result.current.isNear).toBe(false);

    act(() => observer.fire(true));
    expect(result.current.isNear).toBe(true);
    expect(observer.disconnections).toBeGreaterThan(0);
  });

  it('passes a custom reach to the observer', () => {
    const observers = stubIntersectionObserver();
    const { result } = renderHook(() => useNearViewport({ rootMargin: '50% 0px' }));

    act(() => result.current.ref(document.createElement('div')));

    expect(observers.find().rootMargin).toBe('50% 0px');
  });

  it('reports near straight away without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { result } = renderHook(() => useNearViewport());

    act(() => result.current.ref(document.createElement('div')));

    expect(result.current.isNear).toBe(true);
  });
});
