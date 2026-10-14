import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { HOME_CONTENT_FIXTURE } from '../model/content.fixture';
import { HomeView } from './HomeView';

describe('HomeView', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('pitches the engineer in the main heading', () => {
    render(<HomeView content={HOME_CONTENT_FIXTURE} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'AI-Augmented Workflows',
    );
  });

  it('renders every section with its heading', () => {
    render(<HomeView content={HOME_CONTENT_FIXTURE} />);
    for (const name of [
      /five years shipping product/i,
      /front-end depth/i,
      /selected work/i,
      /watch notes/i,
      /build the next one together/i,
    ]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeTruthy();
    }
  });

  it('formats the job periods from their dates', () => {
    render(<HomeView content={HOME_CONTENT_FIXTURE} />);
    expect(screen.getByText('Jul 2024 — Present')).toBeTruthy();
    expect(screen.getByText('Jan 2022 — Jun 2024')).toBeTruthy();
  });

  it('links the navigation to the sections', () => {
    render(<HomeView content={HOME_CONTENT_FIXTURE} />);
    const projectLinks = screen.getAllByRole('link', { name: 'Projects' });
    expect(projectLinks[0]?.getAttribute('href')).toBe('#projects');
  });

  it('opens on the Calendly tab, ahead of the message form', () => {
    render(<HomeView content={HOME_CONTENT_FIXTURE} />);
    const tabs = screen.getAllByRole('tab').map((tab) => tab.textContent);
    expect(tabs).toEqual(['Book a call', 'Send a message']);
    expect(screen.getByRole('tab', { name: 'Book a call' }).getAttribute('aria-selected')).toBe(
      'true',
    );
  });

  it('hides LinkedIn everywhere when the profile is not set', () => {
    const content = {
      ...HOME_CONTENT_FIXTURE,
      site: {
        ...HOME_CONTENT_FIXTURE.site,
        links: { ...HOME_CONTENT_FIXTURE.site.links, linkedin: null },
      },
    };
    render(<HomeView content={content} />);
    expect(screen.queryByRole('link', { name: /linkedin/i })).toBeNull();
  });

  it('shows the content in French once the visitor picks it', () => {
    window.localStorage.setItem('pf-lang', 'fr');
    render(<HomeView content={HOME_CONTENT_FIXTURE} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Productivité augmentée par l’IA',
    );
    expect(screen.getByText('Juil. 2024 — Aujourd’hui')).toBeTruthy();
  });
});
