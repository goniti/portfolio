import type { Project } from './content';

export const PROJECT_CATEGORIES = [
  'react',
  'vue',
  'mobile',
  'full-stack',
  'side-projects',
] as const;

export const PROJECT_FILTERS = ['all', ...PROJECT_CATEGORIES] as const;
export type ProjectFilter = (typeof PROJECT_FILTERS)[number];

/** The projects shown for a filter (`all` keeps every project, in order). */
export function filterProjects(projects: readonly Project[], filter: ProjectFilter): Project[] {
  if (filter === 'all') return [...projects];
  return projects.filter((project) => project.categories.includes(filter));
}
