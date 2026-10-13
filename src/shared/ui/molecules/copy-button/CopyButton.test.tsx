import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CopyButton } from './CopyButton';

function renderCopyButton() {
  return render(
    <CopyButton
      value="hello@example.com"
      label="Copy email"
      copiedLabel="Copied!"
      failedLabel="Copy failed"
    />,
  );
}

describe('CopyButton', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('copies the value and confirms it, then goes back to idle', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    renderCopyButton();

    const button = screen.getByRole('button', { name: 'Copy email' });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeText).toHaveBeenCalledWith('hello@example.com');
    expect(screen.getByRole('status').textContent).toBe('Copied!');
    expect(screen.getByRole('button', { name: 'Copy email' })).toBe(button);

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('announces a refused clipboard', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: () => Promise.reject(new Error('no')) } });
    renderCopyButton();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy email' }));
    });

    expect(screen.getByRole('status').textContent).toBe('Copy failed');
  });
});
