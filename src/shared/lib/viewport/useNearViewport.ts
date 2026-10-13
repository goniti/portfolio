'use client';

import { useEffect, useState, type RefCallback } from 'react';

/**
 * Default reach: two viewport heights below (and above) the screen. On a long page this fires
 * a few screens before the element shows up, so whatever it loads is ready on arrival.
 */
export const NEAR_VIEWPORT_MARGIN = '200% 0px';

export interface UseNearViewportOptions {
  /** How far from the viewport counts as near (an IntersectionObserver `rootMargin`). */
  rootMargin?: string;
}

export interface NearViewport<Target extends Element> {
  /** Attach to the element to watch. */
  ref: RefCallback<Target>;
  /** Becomes `true` the first time the element comes near, and stays `true`. */
  isNear: boolean;
}

/**
 * Tells once an element has come near the viewport, to start loading something heavy (an
 * embed, a video) before the visitor reaches it. One-shot: the observer disconnects as soon
 * as it fires. Without `IntersectionObserver`, it reports `true` straight away.
 */
export function useNearViewport<Target extends Element>({
  rootMargin = NEAR_VIEWPORT_MARGIN,
}: UseNearViewportOptions = {}): NearViewport<Target> {
  const [element, setElement] = useState<Target | null>(null);
  const [hasCome, setHasCome] = useState(false);
  // Without an observer, there is no way to wait: an attached element counts as near.
  const canObserve = typeof IntersectionObserver !== 'undefined';
  const isNear = hasCome || (element !== null && !canObserve);

  useEffect(() => {
    if (!element || isNear || !canObserve) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setHasCome(true);
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, isNear, canObserve, rootMargin]);

  return { ref: setElement, isNear };
}
