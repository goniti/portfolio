import { PROJECT_CATEGORIES } from 'portfolio-content-model';
import { describe, expect, it } from 'vitest';
import { HOME_CONTENT_FIXTURE } from './content.fixture';
import { filterProjects } from './projects';

const PROJECTS = HOME_CONTENT_FIXTURE.projects;

describe('filterProjects', () => {
  it('keeps every project for "all"', () => {
    expect(filterProjects(PROJECTS, 'all')).toHaveLength(PROJECTS.length);
  });

  it('keeps the projects of a category, in order', () => {
    expect(filterProjects(PROJECTS, 'vue').map((project) => project.id)).toEqual([
      'project-advisum',
      'project-decision-trees',
    ]);
  });

  it('never leaves a category empty', () => {
    for (const category of PROJECT_CATEGORIES) {
      expect(filterProjects(PROJECTS, category).length).toBeGreaterThan(0);
    }
  });
});
