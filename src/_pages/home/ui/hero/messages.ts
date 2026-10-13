import type { Localized } from '@/shared/lib/i18n';

const terminal = {
  title: '~/carlos — zsh',
  live: '● live',
  prompt: '$ ',
  script: [
    'whoami',
    'carlos — tech lead @ saper vedere',
    'stack --core',
    'react · vue 3 · typescript · react native',
    'claude "add tests for useCheckout"',
    '✓ 14 tests written · vitest passing',
    'status',
    'open to tech lead & senior roles',
  ],
  stats: {
    clockLabel: 'Lyon',
    buildLabel: 'Build',
    buildValue: 'passing',
    focusLabel: 'Focus',
    focusValue: 'React · AI',
  },
};

const en = {
  badge: 'Tech Lead & Senior Front-End Engineer • Lyon, France',
  // Non-breaking hyphen (\u2011) and space (\u00a0) keep “Front-End |” on one line;
  // the balanced headline would otherwise wrap “Front-/End” or start a line with “|”.
  titleStart: 'Lead Front\u2011End\u00a0| Modern Web Architecture & ',
  titleHighlight: 'AI-Augmented Workflows',
  titleEnd: '.',
  lead: '5 years & 2 startups: led 2 full rebrandings and built 2 zero-to-one apps. Specializing in React, Vue, TS, and AI-Driven Workflows (Claude Code, Cursor).',
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
    titleStart: 'Tech Lead Front\u2011End\u00a0| Architecture Web Moderne & ',
    titleHighlight: 'Productivité augmentée par l’IA',
    titleEnd: '',
    lead: '5 ans & 2 startups : 2 refontes de marque menées et 2 apps construites de zéro. Spécialisé en React, Vue, TS et workflows pilotés par l’IA (Claude Code, Cursor).',
    exploreWork: 'Voir mes projets',
    getInTouch: 'Me contacter',
    newTab: '(nouvel onglet)',
  },
};
