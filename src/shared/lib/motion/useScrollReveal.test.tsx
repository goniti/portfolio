import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REDUCED_MOTION_QUERY } from '../media';
import { stubMatchMedia } from '../testing';
import { REVEAL } from './scrollReveal';
import { useScrollReveal } from './useScrollReveal';

class IdleIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function RevealedPage() {
  useScrollReveal();
  return <h2 {...REVEAL.up}>Below the fold</h2>;
}

describe('useScrollReveal', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => vi.unstubAllGlobals());

  it('arms the marked content below the fold once mounted, and releases it on unmount', () => {
    vi.stubGlobal('IntersectionObserver', IdleIntersectionObserver);
    const { unmount } = render(<RevealedPage />);
    const heading = screen.getByRole('heading');

    expect(heading.getAttribute('data-reveal-state')).toBe('pending');

    unmount();

    expect(heading.hasAttribute('data-reveal-state')).toBe(false);
  });

  it('leaves the content visible with reduced motion', () => {
    stubMatchMedia([REDUCED_MOTION_QUERY]);
    vi.stubGlobal('IntersectionObserver', IdleIntersectionObserver);
    render(<RevealedPage />);

    expect(screen.getByRole('heading').hasAttribute('data-reveal-state')).toBe(false);
  });

  it('leaves the content visible without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<RevealedPage />);

    expect(screen.getByRole('heading').hasAttribute('data-reveal-state')).toBe(false);
  });
});
