import type { Localized } from '@/shared/lib/i18n';
import type { TimelineCounter } from '../../model/useJobTimeline';

/** "01–02 / 04", or "01 / 04" when a single card is open. */
function counter({ first, last, total }: TimelineCounter): string {
  return first === last ? `${first} / ${total}` : `${first}–${last} / ${total}`;
}

/** Name of a timeline dot: the job it scrolls to. */
function dotLabel(company: string, period: string): string {
  return `${company} · ${period}`;
}

// The section title and the jobs are content (Sanity).
const en = {
  eyebrow: '01 — Experience',
  technologiesLabel: 'Technologies',
  /** End of the current position's period. */
  present: 'Present',
  scrollHint: 'Scroll to explore',
  scrollHintGlyph: '↓',
  counter,
  dotLabel,
};

export const experienceMessages: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: '01 — Expérience',
    technologiesLabel: 'Technologies',
    present: 'Aujourd’hui',
    scrollHint: 'Défilez pour explorer',
    scrollHintGlyph: '↓',
    counter,
    dotLabel,
  },
};
