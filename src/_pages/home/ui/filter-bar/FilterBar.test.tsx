import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from './FilterBar';

const OPTIONS = ['all', 'web', 'mobile'] as const;
const LABELS = { all: 'All', web: 'Web', mobile: 'Mobile' };

function renderFilterBar(onChange = vi.fn()) {
  render(
    <FilterBar
      label="Filter projects"
      options={OPTIONS}
      labels={LABELS}
      value="web"
      onChange={onChange}
      look="segment"
    />,
  );
  return onChange;
}

describe('FilterBar', () => {
  it('renders one labelled toggle per option, the selected one pressed', () => {
    renderFilterBar();
    expect(screen.getByRole('group', { name: 'Filter projects' })).toBeTruthy();
    const pressed = screen
      .getAllByRole('button')
      .map((button) => [button.textContent, button.getAttribute('aria-pressed')]);
    expect(pressed).toEqual([
      ['All', 'false'],
      ['Web', 'true'],
      ['Mobile', 'false'],
    ]);
  });

  it('reports the chosen option', () => {
    const onChange = renderFilterBar();
    fireEvent.click(screen.getByRole('button', { name: 'Mobile' }));
    expect(onChange).toHaveBeenCalledWith('mobile');
  });
});
