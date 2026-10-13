import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => vi.unstubAllGlobals());

  it('pitches the engineer in the main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('AI-driven workflows');
  });

  it('renders every section with its heading', () => {
    render(<HomePage />);
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

  it('links the navigation to the sections', () => {
    render(<HomePage />);
    const projectLinks = screen.getAllByRole('link', { name: 'Projects' });
    expect(projectLinks[0]?.getAttribute('href')).toBe('#projects');
  });

  it('hides the Calendly tab without a Calendly URL', () => {
    render(<HomePage />);
    expect(screen.queryByRole('tab', { name: /book a call/i })).toBeNull();
  });
});
