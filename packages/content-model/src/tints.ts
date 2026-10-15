/** Brand tints available to content (dots, glows, placeholders); mapped to tokens in the views. */
export const TINTS = ['indigo', 'cyan', 'violet', 'emerald', 'sky', 'amber'] as const;

export type Tint = (typeof TINTS)[number];

/** Tints a sector may use: it colours the label, top line, timeline dot and bullets of its jobs. */
export const SECTOR_TINTS = [...TINTS] as const satisfies readonly Tint[];

/** Tints a project may use (background behind the screenshot or placeholder). */
export const PROJECT_TINTS = [
  'amber',
  'cyan',
  'emerald',
  'violet',
  'sky',
] as const satisfies readonly Tint[];
