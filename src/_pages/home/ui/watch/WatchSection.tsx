'use client';

import { useState } from 'react';
import { Flex, Grid, Text } from 'goniui';
import { useLocale, useLocalized, useMessages, type Localized } from '@/shared/lib/i18n';
import { REVEAL, revealStagger } from '@/shared/lib/motion';
import { PulseDot } from '@/shared/ui/atoms';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import type { WatchNote } from '../../model/content';
import { formatMonthYear } from '../../model/format';
import { filterNotes, NOTE_CATEGORY_TINT, NOTE_FILTERS } from '../../model/notes';
import { useListFilter } from '../../model/useListFilter';
import { FilterBar } from '../filter-bar/FilterBar';
import { NoteCard } from './NoteCard';
import { NoteDialog } from './NoteDialog';
import { watchMessages } from './messages';

export interface WatchSectionProps {
  title: Localized<string>;
  notes: readonly WatchNote[];
}

/** Tech-watch notes, filterable by topic, each readable in a side panel. */
export function WatchSection({ title, notes }: WatchSectionProps) {
  const { locale } = useLocale();
  const localize = useLocalized();
  const copy = useMessages(watchMessages);
  const { filter, setFilter, visibleItems } = useListFilter(notes, filterNotes, 'all');
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  const openNote = notes.find((note) => note.id === openNoteId) ?? null;

  return (
    <PageSection id="watch" labelledBy="watch-title">
      <Flex justify="between" align="end" wrap="wrap" className="gap-6" {...REVEAL.stagger}>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={localize(title)}
          titleId="watch-title"
          badge={
            <Text
              as="span"
              variant="bodySm"
              className="inline-flex items-center gap-1.5 rounded-full border border-tint-emerald/35 bg-tint-emerald/10 px-2.5 py-1 font-medium font-mono text-2xs text-success"
            >
              <PulseDot size="sm" />
              {copy.continuous}
            </Text>
          }
        />
        <FilterBar
          label={copy.filtersLabel}
          options={NOTE_FILTERS}
          labels={copy.filters}
          value={filter}
          onChange={setFilter}
          look="pill"
        />
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
              title={localize(note.title)}
              excerpt={localize(note.excerpt)}
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
                title: localize(openNote.title),
                excerpt: localize(openNote.excerpt),
                body: openNote.body.map((paragraph) => localize(paragraph)),
                takeaways: openNote.takeaways.map((takeaway) => localize(takeaway)),
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
