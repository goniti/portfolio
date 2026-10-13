import type { SectionId } from './sections';

/** A section becomes active once its top passes this fraction of the viewport height. */
const ACTIVE_SECTION_THRESHOLD = 0.4;
/** The parallax offset stops growing past this scroll position (px). */
export const PARALLAX_MAX_SCROLL = 1400;

export interface ScrollMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

/** Reading progress from 0 (top) to 1 (bottom). */
export function scrollProgress({ scrollTop, scrollHeight, clientHeight }: ScrollMetrics): number {
  const scrollable = scrollHeight - clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / scrollable));
}

/** The last section whose top crossed the activation line; the first one otherwise. */
export function activeSection(
  sectionTops: ReadonlyArray<{ id: SectionId; top: number | null }>,
  viewportHeight: number,
): SectionId | undefined {
  let active = sectionTops[0]?.id;
  for (const { id, top } of sectionTops) {
    if (top !== null && top < viewportHeight * ACTIVE_SECTION_THRESHOLD) active = id;
  }
  return active;
}
