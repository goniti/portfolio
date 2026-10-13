'use client';

import { useCallback, type MouseEvent } from 'react';
import { FINE_POINTER_QUERY, useMediaQuery, usePrefersReducedMotion } from '../media';

/** Share of the pointer's distance from the centre the element follows, per axis. */
const MAGNET_STRENGTH = { x: 0.25, y: 0.35 } as const;
/** Furthest the element leans, per axis (px): keeps wide buttons from sliding away. */
const MAGNET_MAX_OFFSET = { x: 28, y: 14 } as const;

export interface MagnetHandlers<Element extends HTMLElement> {
  onMouseMove: (event: MouseEvent<Element>) => void;
  onMouseLeave: (event: MouseEvent<Element>) => void;
}

export interface UseMagnetOptions {
  /** Turns the pull off without breaking the rules of hooks (defaults to `true`). */
  enabled?: boolean;
}

function clamp(value: number, limit: number): number {
  return Math.max(-limit, Math.min(limit, value));
}

/** The pull applied to an element for a pointer position (px, per axis, capped). */
export function magnetOffset(rect: DOMRect, pointer: { x: number; y: number }) {
  return {
    x: clamp((pointer.x - rect.left - rect.width / 2) * MAGNET_STRENGTH.x, MAGNET_MAX_OFFSET.x),
    y: clamp((pointer.y - rect.top - rect.height / 2) * MAGNET_STRENGTH.y, MAGNET_MAX_OFFSET.y),
  };
}

/**
 * Makes an element lean towards the mouse (pair with the `magnet-offset` utility, which reads
 * `--magnet-x/y`). Inert on touch screens, with reduced motion and when `enabled` is false.
 */
export function useMagnet<Element extends HTMLElement>({
  enabled = true,
}: UseMagnetOptions = {}): MagnetHandlers<Element> {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isEnabled = enabled && hasFinePointer && !prefersReducedMotion;

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
