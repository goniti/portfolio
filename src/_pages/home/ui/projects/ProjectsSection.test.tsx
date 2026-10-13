import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectsSection } from './ProjectsSection';

describe('ProjectsSection', () => {
  it('filters the projects', () => {
    render(<ProjectsSection />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6);

    const mobileFilter = screen.getByRole('button', { name: 'Mobile' });
    fireEvent.click(mobileFilter);
    expect(mobileFilter.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Real-Time Medical Messenger' })).toBeTruthy();
  });

  it('labels each source link with its project', () => {
    render(<ProjectsSection />);
    const link = screen.getByRole('link', { name: /source code of les maillons ludiques/i });
    expect(link.getAttribute('target')).toBe('_blank');
  });
});
