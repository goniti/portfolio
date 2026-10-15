'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Server render and first paint: no media feature is assumed to match. */
const getServerSnapshot = () => false;

/** Environments without `matchMedia` (old browsers, test DOMs) match nothing. */
function canMatchMedia(): boolean {
  return typeof window.matchMedia === 'function';
}

/** Live result of a CSS media query (`false` during server rendering). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!canMatchMedia()) return () => {};
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => canMatchMedia() && window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** Motion is welcome. False during server rendering, so scroll effects start once hydrated. */
export const MOTION_ALLOWED_QUERY = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER_QUERY = '(pointer: fine)';

/** The user asked the system to minimise animation. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}
