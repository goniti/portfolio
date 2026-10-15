/**
 * Step maths of a pinned, scroll-driven list: a window of `openCount` items slides over
 * `itemCount` items as the scroll progress through a tall track runs from 0 to 1.
 */

/** Where a scroll jump lands inside its step: past the start, so the step is clearly active. */
const STEP_LANDING = 0.2;

/** Where an item sits relative to the open window. */
export type ScrollStepPhase = 'past' | 'open' | 'future';

export interface ScrollStepPosition {
  /** Index of the first open item. */
  activeStart: number;
  /** How far through the current step the scroll is, from 0 to 1. */
  fraction: number;
}

export interface ScrollTrackGeometry {
  /** Document offset of the track's top edge (px). */
  trackTop: number;
  trackHeight: number;
  viewportHeight: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** The open window's size: at least one item, at most every item. */
export function clampOpenCount(itemCount: number, openCount: number): number {
  return Math.max(1, Math.min(openCount, itemCount));
}

/** Number of positions the open window takes: `itemCount − openCount + 1`, at least 1. */
export function scrollStepCount(itemCount: number, openCount: number): number {
  return Math.max(1, itemCount - clampOpenCount(itemCount, openCount) + 1);
}

/** The open window at a scroll progress (0 → 1) through the track. */
export function scrollStepAt(
  progress: number,
  itemCount: number,
  openCount: number,
): ScrollStepPosition {
  const stepCount = scrollStepCount(itemCount, openCount);
  const position = clamp(progress, 0, 1) * stepCount;
  const activeStart = Math.min(stepCount - 1, Math.floor(position));
  return { activeStart, fraction: Math.min(1, position - activeStart) };
}

/** The step that opens an item: its own, or the last one for the items it already shows. */
export function itemStep(itemIndex: number, stepCount: number): number {
  return clamp(itemIndex, 0, stepCount - 1);
}

/** Whether an item is before, inside or after the open window. */
export function itemPhase(
  itemIndex: number,
  activeStart: number,
  openCount: number,
): ScrollStepPhase {
  if (itemIndex < activeStart) return 'past';
  if (itemIndex >= activeStart + openCount) return 'future';
  return 'open';
}

/** The document scroll offset that shows a step: its landing point in the track's scroll span. */
export function stepScrollTop(
  step: number,
  stepCount: number,
  { trackTop, trackHeight, viewportHeight }: ScrollTrackGeometry,
): number {
  const span = Math.max(0, trackHeight - viewportHeight);
  return trackTop + (span * (itemStep(step, stepCount) + STEP_LANDING)) / stepCount;
}
