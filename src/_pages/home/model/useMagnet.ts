'use client';

import { useCallback, type MouseEvent } from 'react';
import { FINE_POINTER_QUERY, useMediaQuery, usePrefersReducedMotion } from '@/shared/lib/media';

/** Share of the pointer's distance from the centre the element follows, per axis. */
const MAGNET_STRENGTH = { x: 0.25, y: 0.35 } as const;

export interface MagnetHandlers<Element extends HTMLElement> {
  onMouseMove: (event: MouseEvent<Element>) => void;
  onMouseLeave: (event: MouseEvent<Element>) => void;
}

/** The pull applied to an element for a pointer position (px, per axis). */
export function magnetOffset(rect: DOMRect, pointer: { x: number; y: number }) {
  return {
    x: (pointer.x - rect.left - rect.width / 2) * MAGNET_STRENGTH.x,
    y: (pointer.y - rect.top - rect.height / 2) * MAGNET_STRENGTH.y,
  };
}

/**
 * Makes an element lean towards the mouse (pair with the `magnet-offset` utility, which reads
 * `--magnet-x/y`). Inert on touch screens and with reduced motion.
 */
export function useMagnet<Element extends HTMLElement>(): MagnetHandlers<Element> {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isEnabled = hasFinePointer && !prefersReducedMotion;

  const onMouseMove = useCallback(
    (event: MouseEvent<Element>) => {
      if (!isEnabled) return;
      const element = event.currentTarget;
      const offset = magnetOffset(element.getBoundingClientRect(), {
        x: event.clientX,
        y: event.clientY,
      });
      element.style.setProperty('--magnet-x', `${offset.x}px`);
      element.style.setProperty('--magnet-y', `${offset.y}px`);
    },
    [isEnabled],
  );

  const onMouseLeave = useCallback((event: MouseEvent<Element>) => {
    event.currentTarget.style.removeProperty('--magnet-x');
    event.currentTarget.style.removeProperty('--magnet-y');
  }, []);

  return { onMouseMove, onMouseLeave };
}
