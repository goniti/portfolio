import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCopyToClipboard, writeToClipboard } from './useCopyToClipboard';

function stubClipboard(writeText: (text: string) => Promise<void>) {
  vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn(writeText) } });
  return navigator.clipboard.writeText;
}

describe('writeToClipboard', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('writes the text', async () => {
    const writeText = stubClipboard(() => Promise.resolve());
    await expect(writeToClipboard('hello@site.dev')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello@site.dev');
  });

  it('reports a refused write', async () => {
    stubClipboard(() => Promise.reject(new Error('denied')));
    await expect(writeToClipboard('hello@site.dev')).resolves.toBe(false);
  });

  it('reports a missing clipboard API', async () => {
    vi.stubGlobal('navigator', {});
    await expect(writeToClipboard('hello@site.dev')).resolves.toBe(false);
  });
});

describe('useCopyToClipboard', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('reports the copy, then resets after the delay', async () => {
    vi.useFakeTimers();
    stubClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopyToClipboard(2000));
    expect(result.current.status).toBe('idle');

    await act(() => result.current.copy('hello@site.dev'));
    expect(result.current.status).toBe('copied');

    act(() => vi.advanceTimersByTime(1999));
    expect(result.current.status).toBe('copied');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.status).toBe('idle');
  });

  it('reports a failure without throwing', async () => {
    stubClipboard(() => Promise.reject(new Error('denied')));
    const { result } = renderHook(() => useCopyToClipboard());

    await act(() => result.current.copy('hello@site.dev'));
    expect(result.current.status).toBe('failed');
  });

  it('restarts the delay on a second copy', async () => {
    vi.useFakeTimers();
    stubClipboard(() => Promise.resolve());
    const { result } = renderHook(() => useCopyToClipboard(2000));

    await act(() => result.current.copy('first'));
    act(() => vi.advanceTimersByTime(1500));
    await act(() => result.current.copy('second'));
    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.status).toBe('copied');
  });

  it('clears its timer on unmount', async () => {
    vi.useFakeTimers();
    stubClipboard(() => Promise.resolve());
    const { result, unmount } = renderHook(() => useCopyToClipboard(2000));
    await act(() => result.current.copy('hello@site.dev'));

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
