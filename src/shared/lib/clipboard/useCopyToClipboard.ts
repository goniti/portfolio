'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** `idle` before any copy, then the outcome of the last one until it resets. */
export type CopyStatus = 'idle' | 'copied' | 'failed';

/** How long the outcome stays visible before returning to `idle`. */
export const COPY_FEEDBACK_MS = 2000;

/** Writes `text` to the clipboard; resolves `false` when the API is missing or refused. */
export async function writeToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export interface CopyToClipboardState {
  status: CopyStatus;
  copy: (text: string) => Promise<void>;
}

/**
 * Copies text to the clipboard and reports the outcome (`copied` or `failed`), which resets
 * to `idle` after `resetAfterMs`. Never throws: an unavailable or refused clipboard is `failed`.
 */
export function useCopyToClipboard(resetAfterMs: number = COPY_FEEDBACK_MS): CopyToClipboardState {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = useCallback(
    async (text: string) => {
      const isCopied = await writeToClipboard(text);
      clearTimeout(resetTimer.current);
      setStatus(isCopied ? 'copied' : 'failed');
      resetTimer.current = setTimeout(() => setStatus('idle'), resetAfterMs);
    },
    [resetAfterMs],
  );

  return { status, copy };
}
