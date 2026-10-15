'use client';

import { useRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { FINE_POINTER_QUERY, useMediaQuery, usePrefersReducedMotion } from '../../../lib/media';
import { useCursorFollower } from './useCursorFollower';

export const cursorFollowerVariants = tv({
  base: 'pointer-events-none fixed top-0 left-0 z-100 cursor-geometry transition-opacity duration-200 will-change-transform',
  variants: {
    mode: {
      dot: 'cursor-dot',
      ring: 'cursor-ring',
      magnet: 'cursor-magnet',
      card: 'cursor-card',
      target: 'cursor-card',
    },
    visible: {
      true: 'opacity-100',
      false: 'opacity-0',
    },
  },
  defaultVariants: { mode: 'dot', visible: false },
});

export type CursorFollowerVariants = VariantProps<typeof cursorFollowerVariants>;

function CursorFollowerLayer() {
  const followerRef = useRef<HTMLDivElement>(null);
  const { mode, visible } = useCursorFollower(followerRef);

  return (
    <div
      ref={followerRef}
      aria-hidden="true"
      className={cursorFollowerVariants({ mode, visible })}
    />
  );
}

/**
 * A spring-animated dot following the mouse, wrapping small interactive targets and
 * outlining the cards marked with `CARD_CURSOR_TARGET`.
 * Rendered only for a fine pointer (mouse) and when the visitor accepts motion.
 */
export function CursorFollower() {
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!hasFinePointer || prefersReducedMotion) return null;
  return <CursorFollowerLayer />;
}
