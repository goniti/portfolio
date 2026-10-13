'use client';

import { useEffect, useState } from 'react';

/**
 * Whether the page has scrolled past `viewports` × the viewport height. Same rule as goniui's
 * `BackToTop` (`thresholdViewports`), so both react at the same scroll position.
 */
export function hasScrolledPast(scrollY: number, viewportHeight: number, viewports: number) {
  return scrollY > viewportHeight * viewports;
}

/**
 * Becomes `true` the first time the page scrolls past `viewports` × the viewport height (or
 * starts past it: a reload mid-page), then stays `true` and stops listening. Checks at most
 * once per frame.
 */
export function useScrolledPastOnce(viewports: number): boolean {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    if (isPast) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      if (hasScrolledPast(window.scrollY, window.innerHeight, viewports)) setIsPast(true);
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isPast, viewports]);

  return isPast;
}
