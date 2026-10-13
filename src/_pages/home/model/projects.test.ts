import { describe, expect, it } from 'vitest';
import { filterProjects, PROJECT_CATEGORIES, PROJECTS } from './projects';

describe('filterProjects', () => {
  it('keeps every project for "all"', () => {
    expect(filterProjects(PROJECTS, 'all')).toHaveLength(PROJECTS.length);
  });

  it('keeps the projects of a category, in order', () => {
    expect(filterProjects(PROJECTS, 'vue').map((project) => project.id)).toEqual([
      'advisum',
      'decision-trees',
    ]);
  });

  it('never leaves a category empty', () => {
    for (const category of PROJECT_CATEGORIES) {
      expect(filterProjects(PROJECTS, category).length).toBeGreaterThan(0);
    }
  });
});
