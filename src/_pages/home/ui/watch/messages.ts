import type { Localized } from '@/shared/lib/i18n';
import type { NoteFilter } from '../../model/notes';

// The section title and the notes are content (Sanity).
const en = {
  eyebrow: '04 — AI & Tech Watch',
  continuous: 'Continuous Watch',
  filtersLabel: 'Filter notes',
  filters: {
    all: 'All',
    ai: 'AI',
    'front-end': 'Front-End',
    architecture: 'Architecture',
    ux: 'UX',
  } satisfies Record<NoteFilter, string>,
  categoryTag: (category: string) => `#${category}`,
  cardMeta: (date: string, minutes: number) => `${date} · ${minutes} min`,
  dialogMeta: (category: string, date: string, minutes: number) =>
    `#${category} · ${date} · ${minutes} min`,
  readNote: 'Read note →',
  takeaways: 'Takeaways',
  takeawayGlyph: '→',
  close: 'esc',
  closeLabel: 'Close the note',
};

export const watchMessages: Localized<typeof en> = {
  en,
  fr: {
    ...en,
    eyebrow: '04 — Veille IA & Tech',
    continuous: 'Veille continue',
    filtersLabel: 'Filtrer les notes',
    filters: { ...en.filters, all: 'Tous', ai: 'IA' },
    readNote: 'Lire la note →',
    takeaways: 'À retenir',
    closeLabel: 'Fermer la note',
  },
};
