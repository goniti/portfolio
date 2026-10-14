/** Brand tints available to content (dots, glows, placeholders); mapped to tokens in the views. */
export const TINTS = ['indigo', 'cyan', 'violet', 'emerald', 'sky', 'amber'] as const;

export type Tint = (typeof TINTS)[number];

/** Tints a job may use (timeline dot and bullets). */
export const JOB_TINTS = ['indigo', 'cyan', 'violet'] as const satisfies readonly Tint[];

/** Tints a project may use (background behind the screenshot or placeholder). */
export const PROJECT_TINTS = [
  'amber',
  'cyan',
  'emerald',
  'violet',
  'sky',
] as const satisfies readonly Tint[];
