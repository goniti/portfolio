import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '../../../lib/testing';
import { CtaButton } from './CtaButton';

function hoverNearCorner(element: HTMLElement) {
  element.getBoundingClientRect = () => new DOMRect(0, 0, 100, 50);
  fireEvent.mouseMove(element, { clientX: 90, clientY: 45 });
}

describe('CtaButton', () => {
  beforeEach(() => stubMatchMedia(['(pointer: fine)']));
  afterEach(() => vi.unstubAllGlobals());

  it('makes the primary call to action magnetic, as a button or a link', () => {
    render(
      <>
        <CtaButton type="submit">Send message</CtaButton>
        <CtaButton asChild>
          <a href="#projects">Explore my work</a>
        </CtaButton>
      </>,
    );

    for (const control of [
      screen.getByRole('button', { name: 'Send message' }),
      screen.getByRole('link', { name: 'Explore my work' }),
    ]) {
      expect(control.getAttribute('data-cursor')).toBe('magnet');
      expect(control.className).toContain('magnet-offset');
      hoverNearCorner(control);
      expect(control.style.getPropertyValue('--magnet-x')).toBe('10px');
      fireEvent.mouseLeave(control);
      expect(control.style.getPropertyValue('--magnet-x')).toBe('');
    }
  });

  it('keeps secondary tones still unless asked', () => {
    render(
      <>
        <CtaButton tone="outline">Get in touch</CtaButton>
        <CtaButton tone="outline" magnetic>
          Magnetic outline
        </CtaButton>
      </>,
    );
    const still = screen.getByRole('button', { name: 'Get in touch' });
    expect(still.hasAttribute('data-cursor')).toBe(false);
    hoverNearCorner(still);
    expect(still.style.getPropertyValue('--magnet-x')).toBe('');

    expect(
      screen.getByRole('button', { name: 'Magnetic outline' }).getAttribute('data-cursor'),
    ).toBe('magnet');
  });

  it('still calls the mouse handlers it is given', () => {
    const onMouseMove = vi.fn();
    const onMouseLeave = vi.fn();
    render(
      <CtaButton onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        Send message
      </CtaButton>,
    );
    const button = screen.getByRole('button');
    hoverNearCorner(button);
    fireEvent.mouseLeave(button);
    expect(onMouseMove).toHaveBeenCalledOnce();
    expect(onMouseLeave).toHaveBeenCalledOnce();
  });
});
