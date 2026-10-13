import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { SiteNav } from './SiteNav';

describe('SiteNav', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('switches the copy to French', () => {
    render(<SiteNav />);
    fireEvent.click(screen.getByRole('button', { name: 'Français' }));
    expect(screen.getAllByRole('link', { name: 'Projets' }).length).toBeGreaterThan(0);
  });

  it('toggles the theme', () => {
    document.documentElement.classList.add('dark');
    render(<SiteNav />);
    const [themeToggle] = screen.getAllByRole('button', { name: /switch to light theme/i });
    if (themeToggle) fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('marks the section being read', () => {
    render(<SiteNav />);
    const homeLinks = screen.getAllByRole('link', { name: 'Home' });
    expect(homeLinks[0]?.getAttribute('aria-current')).toBe('location');
  });
});
