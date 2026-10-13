'use client';

import { useScrollReveal } from '../../../lib/motion';

/**
 * Plays the entrance of every element marked with `REVEAL` (`@/shared/lib/motion`) as it
 * scrolls into view. Renders nothing: mount it once, after the page content.
 */
export function ScrollReveal() {
  useScrollReveal();
  return null;
}
