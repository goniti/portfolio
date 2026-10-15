'use client';

import { type RefObject, useCallback, useLayoutEffect } from 'react';
import { type MotionValue, useMotionValueEvent } from 'motion/react';

/**
 * Mirrors a MotionValue into a CSS custom property of an element, outside React: the value can
 * change every frame without re-rendering anything. A utility of `app/globals.css` reads it.
 */
export function useMotionCssVariable(
  ref: RefObject<HTMLElement | null>,
  name: `--${string}`,
  value: MotionValue<number>,
): void {
  const write = useCallback(
    (latest: number) => ref.current?.style.setProperty(name, String(latest)),
    [ref, name],
  );
  useMotionValueEvent(value, 'change', write);
  useLayoutEffect(() => write(value.get()), [write, value]);
}
