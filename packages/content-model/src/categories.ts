export const PROJECT_CATEGORIES = [
  'react',
  'vue',
  'mobile',
  'full-stack',
  'side-projects',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const NOTE_CATEGORIES = ['ai', 'front-end', 'architecture', 'ux'] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];
