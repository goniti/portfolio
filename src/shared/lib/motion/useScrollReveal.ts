'use client';

import { useEffect } from 'react';
import { armScrollReveal } from './scrollReveal';

/**
 * Plays the entrance animation of every element marked with `REVEAL` once it scrolls into
 * view. Call it once per page, after the marked content is rendered.
 */
export function useScrollReveal(): void {
  useEffect(() => armScrollReveal(document), []);
}
