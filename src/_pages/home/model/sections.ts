/** Anchors of the page sections, in reading order (nav order). */
export const SECTION_IDS = [
  'home',
  'experience',
  'skills',
  'projects',
  'watch',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];
