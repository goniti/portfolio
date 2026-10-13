'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/shared/lib/media';
import { typeScript, typewriterCycleLength, type TerminalLine, type TypedLine } from './typewriter';

/**
 * Types `script` out in a loop, one tick every `speedMs`. With reduced motion the whole
 * script is shown at once, without animation.
 */
export function useTypewriter(script: readonly TerminalLine[], speedMs: number): TypedLine[] {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cycleLength = typewriterCycleLength(script);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setTick((current) => (current + 1) % cycleLength);
    }, speedMs);
    return () => window.clearInterval(timer);
  }, [cycleLength, prefersReducedMotion, speedMs]);

  return typeScript(script, prefersReducedMotion ? cycleLength : tick);
}
