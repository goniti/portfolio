import type { ScrollStepPosition } from '@/shared/lib/motion';

/** Base line of the rail: from the first card heading's centre to the last one's (px). */
export interface RailSpan {
  start: number;
  length: number;
}

export function railSpan(headingCentres: readonly number[]): RailSpan {
  const start = headingCentres[0] ?? 0;
  const end = headingCentres.at(-1) ?? start;
  return { start, length: Math.max(0, end - start) };
}

/** Where a point falls along the base line, 0 (first heading) → 1 (last heading). */
export function railPosition(offset: number, { start, length }: RailSpan): number {
  if (length === 0) return 0;
  return Math.min(1, Math.max(0, (offset - start) / length));
}

/**
 * Where the rail fill ends (px): on the heading of the last open card, moving towards the next
 * card's heading as the scroll goes through the step; on the last heading once every card has
 * been reached.
 */
export function railFillEnd(
  headingCentres: readonly number[],
  { activeStart, fraction }: ScrollStepPosition,
  openCount: number,
): number {
  const lastOpen = activeStart + openCount - 1;
  const from = headingCentres[lastOpen];
  const to = headingCentres[lastOpen + 1];
  if (from === undefined || to === undefined) return headingCentres.at(-1) ?? 0;
  return from + (to - from) * fraction;
}

/** Share of the base line the fill covers, 0 → 1 (a scale, so it animates on the compositor). */
export function railFillRatio(
  headingCentres: readonly number[],
  position: ScrollStepPosition,
  openCount: number,
): number {
  const span = railSpan(headingCentres);
  if (span.length === 0) return 1;
  return railPosition(railFillEnd(headingCentres, position, openCount), span);
}
