import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { filterProjects, PROJECTS } from './projects';
import { useListFilter } from './useListFilter';

describe('useListFilter', () => {
  it('starts with the initial filter and narrows the list on change', () => {
    const { result } = renderHook(() => useListFilter(PROJECTS, filterProjects, 'all'));
    expect(result.current.visibleItems).toHaveLength(PROJECTS.length);

    act(() => result.current.setFilter('mobile'));
    expect(result.current.filter).toBe('mobile');
    expect(result.current.visibleItems.map((project) => project.id)).toEqual(['bipper']);
  });
});
