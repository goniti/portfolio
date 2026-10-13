'use client';

import { useState } from 'react';
import * as SegmentedControl from 'goniui/segmented-control';
import { Flex, Grid, Text } from 'goniui';
import { tv } from 'tailwind-variants';
import { useMessages } from '@/shared/lib/i18n';
import { REVEAL, revealStagger } from '@/shared/lib/motion';
import { PulseDot } from '@/shared/ui/atoms';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import {
  filterNotes,
  NOTE_CATEGORY_TINT,
  NOTE_FILTERS,
  WATCH_NOTES,
  type NoteId,
} from '../../model/notes';
import { useListFilter } from '../../model/useListFilter';
import { NoteCard } from './NoteCard';
import { NoteDialog } from './NoteDialog';
import { watchMessages } from './messages';

const noteFilterVariants = tv({
  base: 'min-h-9 flex-none rounded-full border px-3.5 py-0 font-mono text-xs font-medium transition duration-200',
  variants: {
    active: {
      true: 'border-surface-inverse bg-surface-inverse text-foreground-inverse',
      false: 'border-border-strong bg-chip text-foreground-muted hover:text-foreground-strong',
    },
  },
});

/** Tech-watch notes, filterable by topic, each readable in a side panel. */
export function WatchSection() {
  const copy = useMessages(watchMessages);
  const { filter, setFilter, visibleItems } = useListFilter(WATCH_NOTES, filterNotes, 'all');
  const [openNoteId, setOpenNoteId] = useState<NoteId | null>(null);

  const openNote = WATCH_NOTES.find((note) => note.id === openNoteId) ?? null;

  return (
    <PageSection id="watch" labelledBy="watch-title">
      <Flex justify="between" align="end" wrap="wrap" className="gap-6" {...REVEAL.stagger}>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          titleId="watch-title"
          badge={
            <Text
              as="span"
              variant="bodySm"
              className="inline-flex items-center gap-1.5 rounded-full border border-tint-emerald/35 bg-tint-emerald/10 px-2.5 py-1 font-mono text-2xs font-medium text-success"
            >
              <PulseDot size="sm" />
              {copy.continuous}
            </Text>
          }
        />
        <SegmentedControl.Root
          aria-label={copy.filtersLabel}
          className="w-auto flex-wrap gap-1.5 overflow-visible border-0 bg-transparent p-0"
        >
          {NOTE_FILTERS.map((option) => (
            <SegmentedControl.Item
              key={option}
              active={option === filter}
              aria-pressed={option === filter}
              onClick={() => setFilter(option)}
              className={noteFilterVariants({ active: option === filter })}
            >
              {copy.filters[option]}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </Flex>
      <Grid
        as="ul"
        cols={{ base: 1, md: 2, lg: 4 }}
        className="gap-3.5"
        {...revealStagger({ from: 'down' })}
      >
        {visibleItems.map((note) => {
          const noteCopy = copy.notes[note.id];
          return (
            <li key={note.id}>
              <NoteCard
                category={copy.categoryTag(copy.filters[note.category])}
                tint={NOTE_CATEGORY_TINT[note.category]}
                meta={copy.cardMeta(noteCopy.date, note.readingMinutes)}
                title={noteCopy.title}
                excerpt={noteCopy.excerpt}
                cta={copy.readNote}
                onOpen={() => setOpenNoteId(note.id)}
              />
            </li>
          );
        })}
      </Grid>
      <NoteDialog
        note={
          openNote
            ? {
                ...copy.notes[openNote.id],
                tint: NOTE_CATEGORY_TINT[openNote.category],
                meta: copy.dialogMeta(
                  copy.filters[openNote.category],
                  copy.notes[openNote.id].date,
                  openNote.readingMinutes,
                ),
              }
            : null
        }
        onClose={() => setOpenNoteId(null)}
        copy={copy}
      />
    </PageSection>
  );
}
