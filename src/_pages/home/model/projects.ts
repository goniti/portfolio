import type { Tint } from './tints';

export const PROJECT_CATEGORIES = [
  'react',
  'vue',
  'mobile',
  'full-stack',
  'side-projects',
] as const;
type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_FILTERS = ['all', ...PROJECT_CATEGORIES] as const;
export type ProjectFilter = (typeof PROJECT_FILTERS)[number];

export type ProjectId =
  'meeple' | 'bipper' | 'advisum' | 'maillons' | 'design-system' | 'decision-trees';

export interface Project {
  id: ProjectId;
  categories: readonly ProjectCategory[];
  technologies: readonly string[];
  /** Screenshot in `public/`; without one the card shows a placeholder. */
  image?: { src: string; width: number; height: number };
  tint: Extract<Tint, 'amber' | 'cyan' | 'emerald' | 'violet' | 'sky'>;
  /** Live demo; the button is hidden while it is unknown. */
  demoUrl?: string;
  sourceUrl: string;
}

const GITHUB_PROFILE = 'https://github.com/goniti';

export const PROJECTS: readonly Project[] = [
  {
    id: 'meeple',
    categories: ['react', 'full-stack', 'side-projects'],
    technologies: ['React', 'NestJS', 'Fastify', 'Keycloak', 'OWASP'],
    image: { src: '/meeple-dashboard.png', width: 1594, height: 904 },
    tint: 'amber',
    sourceUrl: GITHUB_PROFILE,
  },
  {
    id: 'bipper',
    categories: ['react', 'mobile'],
    technologies: ['React Native', 'GraphQL', 'AWS'],
    tint: 'cyan',
    sourceUrl: GITHUB_PROFILE,
  },
  {
    id: 'advisum',
    categories: ['vue'],
    technologies: ['Vue 3', 'TypeScript', 'Shepherd'],
    tint: 'emerald',
    sourceUrl: GITHUB_PROFILE,
  },
  {
    id: 'maillons',
    categories: ['side-projects'],
    technologies: ['Website', 'Branding', 'Responsive'],
    image: { src: '/maillons-site.png', width: 1691, height: 1027 },
    tint: 'emerald',
    sourceUrl: GITHUB_PROFILE,
  },
  {
    id: 'design-system',
    categories: ['react'],
    technologies: ['React', 'Storybook', 'TypeScript'],
    tint: 'violet',
    sourceUrl: GITHUB_PROFILE,
  },
  {
    id: 'decision-trees',
    categories: ['vue'],
    technologies: ['Vue.js', 'Components'],
    tint: 'sky',
    sourceUrl: GITHUB_PROFILE,
  },
];

/** The projects shown for a filter (`all` keeps every project, in order). */
export function filterProjects(projects: readonly Project[], filter: ProjectFilter): Project[] {
  if (filter === 'all') return [...projects];
  return projects.filter((project) => project.categories.includes(filter));
}
