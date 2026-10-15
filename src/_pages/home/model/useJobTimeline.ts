'use client';

import { type RefObject, useCallback } from 'react';
import { MOTION_ALLOWED_QUERY, useMediaQuery } from '@/shared/lib/media';
import {
  itemPhase,
  type ScrollStepPhase,
  stepRevealing,
  useScrollSteps,
} from '@/shared/lib/motion';
import { formatIndex } from './format';
import { useTimelineRail } from './useTimelineRail';

/** From this width two cards are open at once (the owner's mockup breakpoint). */
const WIDE_TIMELINE_QUERY = '(min-width: 700px)';
const WIDE_OPEN_COUNT = 2;
const NARROW_OPEN_COUNT = 1;

/** "01–02 / 04": the open cards and the total, two digits each. */
export interface TimelineCounter {
  first: string;
  last: string;
  total: string;
}

/** How a card shows: pinned and open, already passed, still to come, or in the plain list. */
export type TimelineCardState = ScrollStepPhase | 'listed';

export interface JobTimeline {
  /**
   * The scroll-driven timeline runs: hydrated, motion allowed. Otherwise every card is open in a
   * plain list (server render, no JavaScript, reduced motion).
   */
  pinned: boolean;
  /** The tall track the page scrolls through. */
  trackRef: RefObject<HTMLDivElement | null>;
  /** The sticky panel holding the rail and the cards. */
  panelRef: RefObject<HTMLDivElement | null>;
  /** First open card (the step), for tests and tooling (`data-active-step`). */
  activeStep: number;
  counter: TimelineCounter;
  /** The last card is open: the rail's tail lights up. */
  reachedEnd: boolean;
  cardState: (jobIndex: number) => TimelineCardState;
  /** Scrolls the least needed to open a card; an open card stays put. */
  openCard: (jobIndex: number) => void;
}

/**
 * The pinned career timeline: as the page scrolls through the track, a window of cards (two on
 * wide screens, one on narrow ones) opens in turn and the rail fills towards the next card.
 * React re-renders on step changes only; the rail follows the scroll outside React.
 */
export function useJobTimeline(jobCount: number): JobTimeline {
  const pinned = useMediaQuery(MOTION_ALLOWED_QUERY);
  const wide = useMediaQuery(WIDE_TIMELINE_QUERY);
  const requestedOpenCount = wide ? WIDE_OPEN_COUNT : NARROW_OPEN_COUNT;
  const { trackRef, progress, activeStart, openCount, stepCount, scrollToStep } =
    useScrollSteps<HTMLDivElement>({
      itemCount: jobCount,
      openCount: pinned ? requestedOpenCount : jobCount,
    });
  const panelRef = useTimelineRail<HTMLDivElement>({ progress, itemCount: jobCount, openCount });

  const cardState = useCallback(
    (jobIndex: number): TimelineCardState =>
      pinned ? itemPhase(jobIndex, activeStart, openCount) : 'listed',
    [pinned, activeStart, openCount],
  );
  const openCard = useCallback(
    (jobIndex: number) => {
      const step = stepRevealing(jobIndex, activeStart, openCount, stepCount);
      if (step !== null) scrollToStep(step);
    },
    [scrollToStep, activeStart, openCount, stepCount],
  );

  return {
    pinned,
    trackRef,
    panelRef,
    activeStep: activeStart,
    counter: {
      first: formatIndex(activeStart, 1),
      last: formatIndex(activeStart + openCount - 1, 1),
      total: formatIndex(jobCount),
    },
    reachedEnd: activeStart + openCount >= jobCount,
    cardState,
    openCard,
  };
}
