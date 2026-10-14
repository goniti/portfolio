import type { Localized } from '@/shared/lib/i18n';
import type { ProjectFilter } from '../../model/projects';

// The section title and the projects are content (Sanity).
const en = {
  eyebrow: '03 — Projects',
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
};

export const projectsMessages: Localized<typeof en> = {
  en,
  fr: {
    ...en,
    eyebrow: '03 — Projets',
    filtersLabel: 'Filtrer les projets',
    filters: { ...en.filters, all: 'Tous', 'side-projects': 'Projets perso' },
    demo: 'Démo ↗',
    demoLabel: (title: string) => `Démo de ${title} (nouvel onglet)`,
    source: 'Code source',
    sourceLabel: (title: string) => `Code source de ${title} (nouvel onglet)`,
  },
};
