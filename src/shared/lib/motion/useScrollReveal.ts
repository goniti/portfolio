'use client';

import { useEffect } from 'react';
import { armScrollReveal } from './scrollReveal';

/**
 * Plays the entrance animation of every element marked with `REVEAL` once it scrolls into
 * view. Call it once per page, in the client component rendering the marked content: its
 * effect runs after its children's, so every marker is in the DOM when it arms.
 */
export function useScrollReveal(): void {
  useEffect(() => armScrollReveal(document), []);
}
