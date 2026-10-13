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
    focusValue: 'Vue 3 · AI',
  },
};

const en = {
  badge: 'Tech Lead & Senior Front-End Engineer • Lyon, France',
  titleStart: 'Front-End Engineer & Tech Lead fusing modern React architectures with ',
  titleHighlight: 'AI-driven workflows',
  titleEnd: ' to ship faster.',
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
    titleStart: 'Front-End Engineer & Tech Lead, j’allie architectures React modernes et ',
    titleHighlight: 'workflows pilotés par l’IA',
    titleEnd: ' pour livrer plus vite.',
    lead: '5 ans & 2 startups : 2 refontes de marque menées et 2 apps construites de zéro. Spécialisé en React, Vue, TS et workflows pilotés par l’IA (Claude Code, Cursor).',
    exploreWork: 'Voir mes projets',
    getInTouch: 'Me contacter',
    newTab: '(nouvel onglet)',
  },
};
