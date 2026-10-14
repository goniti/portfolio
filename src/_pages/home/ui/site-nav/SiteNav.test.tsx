import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { SiteNav } from './SiteNav';

const { ownerName, avatarUrl } = HOME_CONTENT_FIXTURE.site;

describe('SiteNav', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('switches the copy to French', () => {
    render(<SiteNav ownerName={ownerName} avatarUrl={avatarUrl} />);
    fireEvent.click(screen.getByRole('button', { name: 'FR Français' }));
    expect(screen.getAllByRole('link', { name: 'Projets' }).length).toBeGreaterThan(0);
  });

  it('toggles the theme', () => {
    document.documentElement.classList.add('dark');
    render(<SiteNav ownerName={ownerName} avatarUrl={avatarUrl} />);
    const [themeToggle] = screen.getAllByRole('button', { name: /switch to light theme/i });
    if (themeToggle) fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('marks the section being read', () => {
    render(<SiteNav ownerName={ownerName} avatarUrl={avatarUrl} />);
    const homeLinks = screen.getAllByRole('link', { name: 'Home' });
    expect(homeLinks[0]?.getAttribute('aria-current')).toBe('location');
  });
});
