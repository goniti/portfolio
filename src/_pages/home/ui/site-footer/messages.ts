import type { Localized } from '@/shared/lib/i18n';

const en = {
  status: {
    open: 'Open to Tech Lead & Senior Roles • Based in Lyon / Remote',
    busy: 'Currently heads-down • Based in Lyon / Remote',
  },
  credits: [
    '© 2026 Carlos Gonzalez Lo Vullo',
    'Built with React + Framer Motion',
    'Designed & coded in Lyon',
  ],
  nextCredit: 'Show another credit',
};

export const siteFooterMessages: Localized<typeof en> = {
  en,
  fr: {
    status: {
      open: 'Ouvert aux postes Tech Lead & Senior • Lyon / Télétravail',
      busy: 'Actuellement en poste • Lyon / Télétravail',
    },
    credits: [
      '© 2026 Carlos Gonzalez Lo Vullo',
      'Conçu avec React + Framer Motion',
      'Designé & codé à Lyon',
    ],
    nextCredit: 'Afficher un autre crédit',
  },
};
