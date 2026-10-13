import { describe, expect, it } from 'vitest';
import { filterNotes, WATCH_NOTES } from './notes';

describe('filterNotes', () => {
  it('keeps every note for "all"', () => {
    expect(filterNotes(WATCH_NOTES, 'all')).toEqual(WATCH_NOTES);
  });

  it('keeps the notes of one category', () => {
    expect(filterNotes(WATCH_NOTES, 'ux').map((note) => note.id)).toEqual(['design-systems']);
  });
});
