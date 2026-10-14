import type { Localized } from '@/shared/lib/i18n';

// The section title and the jobs are content (Sanity).
const en = {
  eyebrow: '01 — Experience',
  technologiesLabel: 'Technologies',
  /** End of the current position's period. */
  present: 'Present',
};

export const experienceMessages: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: '01 — Expérience',
    technologiesLabel: 'Technologies',
    present: 'Aujourd’hui',
  },
};
