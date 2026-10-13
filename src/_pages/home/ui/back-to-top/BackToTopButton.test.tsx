import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { BackToTopButton } from './BackToTopButton';

function scrollTo(position: number) {
  act(() => {
    window.scrollY = position;
    fireEvent.scroll(window);
  });
}

describe('BackToTopButton', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
    window.scrollY = 0;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('is hidden at the top and appears past the hero', () => {
    stubMatchMedia();
    render(<BackToTopButton />);
    expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull();

    scrollTo(window.innerHeight * 2);
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeTruthy();

    scrollTo(0);
    expect(screen.queryByRole('button', { name: 'Back to top' })).toBeNull();
  });

  it('scrolls smoothly back to the top', () => {
    stubMatchMedia();
    const scrollToTop = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<BackToTopButton />);
    scrollTo(window.innerHeight * 2);

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(scrollToTop).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('jumps instantly with reduced motion', () => {
    stubMatchMedia(['(prefers-reduced-motion: reduce)']);
    const scrollToTop = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<BackToTopButton />);
    scrollTo(window.innerHeight * 2);

    fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));
    expect(scrollToTop).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });
});
