'use client';

import { useState } from 'react';
import * as SegmentedControl from 'goniui/segmented-control';
import { Flex, Grid, Text } from 'goniui';
import { tv } from 'tailwind-variants';
import { useLocale, useMessages, type Localized } from '@/shared/lib/i18n';
import { REVEAL, revealStagger } from '@/shared/lib/motion';
import { PulseDot } from '@/shared/ui/atoms';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import type { WatchNote } from '../../model/content';
import { formatMonthYear } from '../../model/format';
import { filterNotes, NOTE_CATEGORY_TINT, NOTE_FILTERS } from '../../model/notes';
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

export interface WatchSectionProps {
  title: Localized<string>;
  notes: readonly WatchNote[];
}

/** Tech-watch notes, filterable by topic, each readable in a side panel. */
export function WatchSection({ title, notes }: WatchSectionProps) {
  const { locale } = useLocale();
  const copy = useMessages(watchMessages);
  const { filter, setFilter, visibleItems } = useListFilter(notes, filterNotes, 'all');
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  const openNote = notes.find((note) => note.id === openNoteId) ?? null;

  return (
    <PageSection id="watch" labelledBy="watch-title">
      <Flex justify="between" align="end" wrap="wrap" className="gap-6" {...REVEAL.stagger}>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={title[locale]}
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
        {visibleItems.map((note) => (
          <li key={note.id}>
            <NoteCard
              category={copy.categoryTag(copy.filters[note.category])}
              tint={NOTE_CATEGORY_TINT[note.category]}
              meta={copy.cardMeta(formatMonthYear(note.publishedAt, locale), note.readingMinutes)}
              title={note.title[locale]}
              excerpt={note.excerpt[locale]}
              cta={copy.readNote}
              onOpen={() => setOpenNoteId(note.id)}
            />
          </li>
        ))}
      </Grid>
      <NoteDialog
        note={
          openNote
            ? {
                title: openNote.title[locale],
                excerpt: openNote.excerpt[locale],
                body: openNote.body.map((paragraph) => paragraph[locale]),
                takeaways: openNote.takeaways.map((takeaway) => takeaway[locale]),
                tint: NOTE_CATEGORY_TINT[openNote.category],
                meta: copy.dialogMeta(
                  copy.filters[openNote.category],
                  formatMonthYear(openNote.publishedAt, locale),
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
