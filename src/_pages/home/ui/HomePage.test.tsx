import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { HOME_CONTENT_FIXTURE } from '../model/content.fixture';
import { generateHomeMetadata, HomePage } from './HomePage';

// The page fetches at build time; the unit tests never reach Sanity.
vi.mock('../api/getHomeContent', () => ({
  getHomeContent: vi.fn(async () => HOME_CONTENT_FIXTURE),
}));

describe('HomePage', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('renders the fetched content', async () => {
    render(await HomePage());
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Carlos Gonzalez Lo Vullo',
    );
  });

  it('passes the Calendly page of the environment to the view', async () => {
    vi.stubEnv('NEXT_PUBLIC_CALENDLY_URL', 'https://calendly.com/carlos/intro');
    vi.resetModules();
    const { HomePage: FreshHomePage } = await import('./HomePage');
    render(await FreshHomePage());
    expect(screen.getByRole('tab', { name: 'Book a call' })).toBeDefined();
  });

  it('takes the <head> from the SEO fields, in the default locale', async () => {
    expect(await generateHomeMetadata()).toEqual({
      title: 'Carlos Gonzalez Lo Vullo — Lead Front-End Developer, Lyon',
      description: expect.stringContaining('Lyon, France · Remote'),
    });
  });
});
