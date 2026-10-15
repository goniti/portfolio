'use client';

import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  type MotionValue,
  type UseScrollOptions,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react';
import { usePrefersReducedMotion } from '../media';
import { clampOpenCount, scrollStepAt, scrollStepCount, stepScrollTop } from './scrollSteps';

/** Progress runs from the track's top reaching the viewport top to its bottom reaching the bottom. */
const TRACK_OFFSET: UseScrollOptions['offset'] = ['start start', 'end end'];

export interface UseScrollStepsOptions {
  itemCount: number;
  /** Items open at once (the window that slides over the list). */
  openCount: number;
}

export interface ScrollSteps<Track extends HTMLElement> {
  /** The tall element the scroll runs through; it gets `--scroll-step-count` to size itself. */
  trackRef: RefObject<Track | null>;
  /** Scroll progress through the track, 0 → 1 (no re-render). */
  progress: MotionValue<number>;
  /** Progress through the current step, 0 → 1 (no re-render). */
  fraction: MotionValue<number>;
  /** First open item: React state, updated only when the step changes. */
  activeStart: number;
  /** Open window size, clamped to the item count. */
  openCount: number;
  stepCount: number;
  /** Scrolls the page to a step (smoothly, unless the user prefers reduced motion). */
  scrollToStep: (step: number) => void;
}

/**
 * Turns the scroll progress through a track into steps of a sliding window of open items. The
 * continuous values are MotionValues; the component re-renders only when the step changes.
 */
export function useScrollSteps<Track extends HTMLElement = HTMLElement>({
  itemCount,
  openCount: requestedOpenCount,
}: UseScrollStepsOptions): ScrollSteps<Track> {
  const trackRef = useRef<Track>(null);
  const { scrollYProgress: progress } = useScroll({ target: trackRef, offset: TRACK_OFFSET });
  const openCount = clampOpenCount(itemCount, requestedOpenCount);
  const stepCount = scrollStepCount(itemCount, openCount);
  const fraction = useTransform(
    progress,
    (latest) => scrollStepAt(latest, itemCount, openCount).fraction,
  );

  const [activeStart, setActiveStart] = useState(0);
  const activeStartRef = useRef(activeStart);
  const syncStep = useCallback(
    (latest: number) => {
      const nextStart = scrollStepAt(latest, itemCount, openCount).activeStart;
      if (nextStart === activeStartRef.current) return;
      activeStartRef.current = nextStart;
      setActiveStart(nextStart);
    },
    [itemCount, openCount],
  );
  useMotionValueEvent(progress, 'change', syncStep);
  // A new item count or window size moves the steps under the current scroll position.
  useEffect(() => syncStep(progress.get()), [syncStep, progress]);

  useLayoutEffect(() => {
    trackRef.current?.style.setProperty('--scroll-step-count', String(stepCount));
  }, [stepCount]);

  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollToStep = useCallback(
    (step: number) => {
      const track = trackRef.current;
      if (!track) return;
      const top = stepScrollTop(step, stepCount, {
        trackTop: track.getBoundingClientRect().top + window.scrollY,
        trackHeight: track.offsetHeight,
        viewportHeight: window.innerHeight,
      });
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    },
    [stepCount, prefersReducedMotion],
  );

  return {
    trackRef,
    progress,
    fraction,
    activeStart: Math.min(activeStart, stepCount - 1),
    openCount,
    stepCount,
    scrollToStep,
  };
}
