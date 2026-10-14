import { describe, expect, it } from 'vitest';
import { HOME_CONTENT_FIXTURE } from './content.fixture';
import { filterNotes } from './notes';

const WATCH_NOTES = HOME_CONTENT_FIXTURE.notes;

describe('filterNotes', () => {
  it('keeps every note for "all"', () => {
    expect(filterNotes(WATCH_NOTES, 'all')).toEqual(WATCH_NOTES);
  });

  it('keeps the notes of one category', () => {
    expect(filterNotes(WATCH_NOTES, 'ux').map((note) => note.id)).toEqual(['note-design-systems']);
  });
});
