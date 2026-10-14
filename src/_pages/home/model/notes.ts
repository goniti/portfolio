import { NOTE_CATEGORIES, type NoteCategory, type Tint } from 'portfolio-content-model';
import type { WatchNote } from './content';

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
