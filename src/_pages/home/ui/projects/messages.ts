import type { Localized } from '@/shared/lib/i18n';
import type { ProjectFilter, ProjectId } from '../../model/projects';

interface ProjectCopy {
  title: string;
  kind: string;
  description: string;
  /** Placeholder caption while the project has no screenshot. */
  placeholder?: string;
}

const en = {
  eyebrow: '03 — Projects',
  title: 'Selected work.',
  filtersLabel: 'Filter projects',
  filters: {
    all: 'All',
    react: 'React',
    vue: 'Vue',
    mobile: 'Mobile',
    'full-stack': 'Full-Stack',
    'side-projects': 'Side Projects',
  } satisfies Record<ProjectFilter, string>,
  demo: 'Live Demo ↗',
  demoLabel: (title: string) => `Live Demo of ${title} (opens in a new tab)`,
  source: 'Source Code',
  sourceLabel: (title: string) => `Source Code of ${title} (opens in a new tab)`,
  projects: {
    meeple: {
      title: 'Meeple — association management SaaS',
      kind: 'Personal project · Full-Stack',
      description:
        'Events, openings, checklists, inventory and tabs for board-game associations. Keycloak auth, NestJS/Fastify API, OWASP-hardened VPS.',
    },
    bipper: {
      title: 'Real-Time Medical Messenger',
      kind: 'Bipper · PulseLife',
      description:
        'Secure messaging for healthcare teams on iOS, Android and web, with real-time GraphQL on AWS.',
      placeholder: 'app screen recording',
    },
    advisum: {
      title: 'UI Automation & Audit Tool',
      kind: 'Advisum · Saper Vedere',
      description: 'Scripted guided tours and automated UI audits across the Advisum platform.',
      placeholder: 'dashboard screenshot',
    },
    maillons: {
      title: 'Les Maillons Ludiques',
      kind: 'Side project · Website',
      description:
        'Website for a board-game association in Machezal: events, library, membership and gallery.',
    },
    'design-system': {
      title: 'Storybook Design System',
      kind: 'PulseLife',
      description:
        'Shared component library documented in Storybook, used across mobile and web apps.',
      placeholder: 'storybook capture',
    },
    'decision-trees': {
      title: 'Medical Decision Trees',
      kind: 'PulseLife',
      description:
        'Interfaces guiding clinicians through decision trees, on a shared Vue component library.',
      placeholder: 'flow diagram',
    },
  } satisfies Record<ProjectId, ProjectCopy>,
};

export const projectsMessages: Localized<typeof en> = {
  en,
  fr: {
    ...en,
    eyebrow: '03 — Projets',
    title: 'Projets choisis.',
    filtersLabel: 'Filtrer les projets',
    filters: { ...en.filters, all: 'Tous', 'side-projects': 'Projets perso' },
    demo: 'Démo ↗',
    demoLabel: (title: string) => `Démo de ${title} (nouvel onglet)`,
    source: 'Code source',
    sourceLabel: (title: string) => `Code source de ${title} (nouvel onglet)`,
    projects: {
      meeple: {
        title: 'Meeple — SaaS de gestion d’associations',
        kind: 'Projet perso · Full-Stack',
        description:
          'Événements, ouvertures, checklists, inventaire et ardoises pour associations ludiques. Auth Keycloak, API NestJS/Fastify, VPS durci OWASP.',
      },
      bipper: {
        ...en.projects.bipper,
        title: 'Messagerie médicale temps réel',
        description:
          'Messagerie sécurisée pour équipes soignantes sur iOS, Android et web, GraphQL temps réel sur AWS.',
      },
      advisum: {
        ...en.projects.advisum,
        title: 'Outil d’automatisation & d’audit UI',
        description: 'Parcours guidés scriptés et audits UI automatisés sur la plateforme Advisum.',
      },
      maillons: {
        title: 'Les Maillons Ludiques',
        kind: 'Projet perso · Site web',
        description:
          'Site d’une association de jeux de société à Machezal : soirées, ludothèque, adhésion et galerie.',
      },
      'design-system': {
        ...en.projects['design-system'],
        description:
          'Bibliothèque de composants documentée dans Storybook, partagée entre apps mobile et web.',
      },
      'decision-trees': {
        ...en.projects['decision-trees'],
        title: 'Arbres de décision médicaux',
        description:
          'Interfaces guidant les soignants dans des arbres de décision, sur une bibliothèque Vue partagée.',
      },
    },
  },
};
