import type { Tint } from './tints';

const NOTE_CATEGORIES = ['ai', 'front-end', 'architecture', 'ux'] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export const NOTE_FILTERS = ['all', ...NOTE_CATEGORIES] as const;
export type NoteFilter = (typeof NOTE_FILTERS)[number];

/** Accent of each category (tag colour). */
export const NOTE_CATEGORY_TINT = {
  ai: 'violet',
  'front-end': 'cyan',
  architecture: 'indigo',
  ux: 'amber',
} as const satisfies Record<NoteCategory, Tint>;

export type NoteId = 'ai-workflows' | 'server-components' | 'design-systems' | 'real-time';

export interface WatchNote {
  id: NoteId;
  category: NoteCategory;
  readingMinutes: number;
}

/** Tech-watch notes, newest first; the wording lives in `ui/watch/messages.ts`. */
export const WATCH_NOTES: readonly WatchNote[] = [
  { id: 'ai-workflows', category: 'ai', readingMinutes: 5 },
  { id: 'server-components', category: 'front-end', readingMinutes: 6 },
  { id: 'design-systems', category: 'ux', readingMinutes: 4 },
  { id: 'real-time', category: 'architecture', readingMinutes: 5 },
];

export function filterNotes(notes: readonly WatchNote[], filter: NoteFilter): WatchNote[] {
  if (filter === 'all') return [...notes];
  return notes.filter((note) => note.category === filter);
}
