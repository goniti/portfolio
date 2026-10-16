'use client';

import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  type MotionValue,
  type UseScrollOptions,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react';
import { usePrefersReducedMotion } from '../media';
import {
  holdStillThroughSnap,
  isScrollJumping,
  onScrollJumpEnd,
  startScrollJump,
} from './scrollJump';
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
  /**
   * Scroll progress through the track, 0 → 1 (no re-render). It holds still while the track is
   * outside the viewport and during a programmatic scroll jump (`startScrollJump`); it catches up
   * when a jump lands inside the track, and snaps, without transitions, as soon as the track
   * enters the viewport by hand.
   */
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
  /**
   * Jumps back to the landing point of the step the timeline is on (a scroll jump, so the steps
   * hold still on the way; at once under reduced motion).
   */
  scrollToCurrentStep: () => void;
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
  const { scrollYProgress } = useScroll({ target: trackRef, offset: TRACK_OFFSET });
  const progress = useMotionValue(scrollYProgress.get());
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
  const followScroll = useCallback(
    (latest: number) => {
      progress.set(latest);
      syncStep(latest);
    },
    [progress, syncStep],
  );
  // Back by hand after leaving (from the contact form, say), the track shows the right step as
  // soon as it enters the viewport, with no animated catch-up. Entering during a jump waits for
  // the jump end.
  const snapOnEnter = useCallback(() => {
    if (!isScrollJumping()) holdStillThroughSnap(() => followScroll(scrollYProgress.get()));
  }, [followScroll, scrollYProgress]);
  const isInViewRef = useTrackInView(trackRef, snapOnEnter);
  // The steps follow the scroll through the track only: a jump across it (a menu link) or a scroll
  // elsewhere on the page leaves them where they are.
  const onScroll = useCallback(
    (latest: number) => {
      if (isInViewRef.current && !isScrollJumping()) followScroll(latest);
    },
    [followScroll, isInViewRef],
  );
  useMotionValueEvent(scrollYProgress, 'change', onScroll);
  // A jump landing inside the track (a card, a dot, a link back) syncs, already without transitions.
  useEffect(
    () =>
      onScrollJumpEnd(() => {
        if (isInViewRef.current) followScroll(scrollYProgress.get());
      }),
    [followScroll, scrollYProgress, isInViewRef],
  );
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
  const scrollToCurrentStep = useCallback(() => {
    startScrollJump();
    scrollToStep(activeStartRef.current);
  }, [scrollToStep]);

  return {
    trackRef,
    progress,
    fraction,
    activeStart: Math.min(activeStart, stepCount - 1),
    openCount,
    stepCount,
    scrollToStep,
    scrollToCurrentStep,
  };
}

/**
 * Tracks whether the track is in the viewport (always, where `IntersectionObserver` is missing),
 * and calls `onEnter` each time it enters. The observer is not rebuilt when `onEnter` changes.
 */
function useTrackInView(
  trackRef: RefObject<HTMLElement | null>,
  onEnter: () => void,
): RefObject<boolean> {
  const isInViewRef = useRef(true);
  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      const latest = entries.at(-1);
      if (!latest) return;
      isInViewRef.current = latest.isIntersecting;
      if (latest.isIntersecting) onEnterRef.current();
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef]);
  return isInViewRef;
}
