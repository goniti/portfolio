import type { WatchNote } from './content';
import type { Tint } from './tints';

export const NOTE_CATEGORIES = ['ai', 'front-end', 'architecture', 'ux'] as const;
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

export function filterNotes(notes: readonly WatchNote[], filter: NoteFilter): WatchNote[] {
  if (filter === 'all') return [...notes];
  return notes.filter((note) => note.category === filter);
}
