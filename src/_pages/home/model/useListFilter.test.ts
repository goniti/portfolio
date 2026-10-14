import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HOME_CONTENT_FIXTURE } from './content.fixture';
import { filterProjects } from './projects';
import { useListFilter } from './useListFilter';

const PROJECTS = HOME_CONTENT_FIXTURE.projects;

describe('useListFilter', () => {
  it('starts with the initial filter and narrows the list on change', () => {
    const { result } = renderHook(() => useListFilter(PROJECTS, filterProjects, 'all'));
    expect(result.current.visibleItems).toHaveLength(PROJECTS.length);

    act(() => result.current.setFilter('mobile'));
    expect(result.current.filter).toBe('mobile');
    expect(result.current.visibleItems.map((project) => project.id)).toEqual(['project-bipper']);
  });
});
