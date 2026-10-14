/** Brand tints available to content (dots, glows, placeholders); mapped to tokens in the views. */
export const TINTS = ['indigo', 'cyan', 'violet', 'emerald', 'sky', 'amber'] as const;

export type Tint = (typeof TINTS)[number];
