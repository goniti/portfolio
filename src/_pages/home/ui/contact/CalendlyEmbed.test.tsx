import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CalendlyEmbed } from './CalendlyEmbed';

const PROPS = {
  src: 'https://calendly.com/carlos/intro?embed_type=Inline',
  title: 'Book a call',
  loadingLabel: 'Loading the calendar',
  loadAfterViewports: 0.9,
};

describe('CalendlyEmbed', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('waits until it comes near the viewport before loading the frame', () => {
    class IdleIntersectionObserver {
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', IdleIntersectionObserver);
    render(<CalendlyEmbed {...PROPS} />);

    expect(screen.queryByTitle(PROPS.title)).toBeNull();
    expect(screen.getByRole('status').textContent).toContain(PROPS.loadingLabel);
  });

  it('keeps the skeleton until the frame has loaded, then drops it', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<CalendlyEmbed {...PROPS} />);
    const frame = screen.getByTitle(PROPS.title);

    expect(frame.getAttribute('src')).toBe(PROPS.src);
    expect(frame.className).toContain('opacity-0');
    expect(screen.getByRole('status')).toBeTruthy();

    fireEvent.load(frame);

    expect(frame.className).toContain('opacity-100');
    expect(screen.queryByRole('status')).toBeNull();
  });
});
