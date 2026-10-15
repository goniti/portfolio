import type { Localized } from '@/shared/lib/i18n';

// The pitch (badge, tagline, lead), the person (name, job title, location), the terminal script
// and the focus stat are content (Sanity).
const terminal = {
  title: '~/carlos — zsh',
  live: '● live',
  prompt: '$ ',
  stats: {
    clockLabel: 'Lyon',
    buildLabel: 'Build',
    buildValue: 'passing',
    focusLabel: 'Focus',
  },
};

const en = {
  /** Between the full name and the job title of the heading. */
  titleSeparator: ' — ',
  remote: 'Remote',
  exploreWork: 'Explore My Work',
  arrow: '→',
  getInTouch: 'Get in Touch',
  socials: { github: 'GitHub ↗', linkedin: 'LinkedIn ↗', email: 'Email ↗' },
  newTab: '(opens in a new tab)',
  terminal,
};

export const heroMessages: Localized<typeof en> = {
  en,
  fr: {
    ...en,
    remote: 'Télétravail',
    exploreWork: 'Voir mes projets',
    getInTouch: 'Me contacter',
    newTab: '(nouvel onglet)',
  },
};
