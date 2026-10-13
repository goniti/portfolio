import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { applyTheme, useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => applyTheme('dark'));
  afterEach(() => window.localStorage.clear());

  it('reads the theme from the html class', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('toggles and persists the theme', async () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(window.localStorage.getItem('pf-theme')).toBe('light');
    await waitFor(() => expect(result.current.theme).toBe('light'));
  });

  it('restores the stored theme', async () => {
    window.localStorage.setItem('pf-theme', 'light');
    const { result } = renderHook(() => useTheme());
    await waitFor(() => expect(result.current.theme).toBe('light'));
  });
});
