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
  afterEach(() => vi.unstubAllGlobals());

  it('renders the fetched content', async () => {
    render(await HomePage());
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'AI-Augmented Workflows',
    );
  });

  it('takes the <head> from the SEO fields, in the default locale', async () => {
    expect(await generateHomeMetadata()).toEqual({
      title: 'Carlos Gonzalez Lo Vullo — Tech Lead & Senior Front-End Engineer',
      description: expect.stringContaining('Front-End Engineer & Tech Lead'),
    });
  });
});
