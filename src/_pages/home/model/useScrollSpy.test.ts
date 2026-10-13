import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScrollSpy } from './useScrollSpy';

describe('useScrollSpy', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('reports the section being read and writes the scroll variables', () => {
    const experience = document.createElement('section');
    experience.id = 'experience';
    document.body.append(experience);
    vi.spyOn(experience, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 900, 100, 100));

    const { result } = renderHook(() => useScrollSpy());
    expect(result.current).toBe('home');
    expect(document.documentElement.style.getPropertyValue('--scroll-progress')).toBe('0');

    vi.spyOn(experience, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 50, 100, 100));
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('experience');
  });

  it('stops listening on unmount', () => {
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollSpy());
    unmount();
    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
