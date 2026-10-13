import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { magnetOffset, useMagnet } from './useMagnet';

function MagneticLink() {
  const magnet = useMagnet<HTMLAnchorElement>();
  return (
    <a href="#projects" onMouseMove={magnet.onMouseMove} onMouseLeave={magnet.onMouseLeave}>
      Projects
    </a>
  );
}

describe('magnetOffset', () => {
  it('is zero at the centre', () => {
    expect(magnetOffset(new DOMRect(0, 0, 100, 50), { x: 50, y: 25 })).toEqual({ x: 0, y: 0 });
  });

  it('pulls towards the pointer, more vertically', () => {
    expect(magnetOffset(new DOMRect(0, 0, 100, 50), { x: 90, y: 45 })).toEqual({ x: 10, y: 7 });
  });
});

describe('useMagnet', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('writes the offset on the hovered element and clears it on leave', () => {
    stubMatchMedia(['(pointer: fine)']);
    render(<MagneticLink />);
    const link = screen.getByRole('link');
    link.getBoundingClientRect = () => new DOMRect(0, 0, 100, 50);

    fireEvent.mouseMove(link, { clientX: 90, clientY: 45 });
    expect(link.style.getPropertyValue('--magnet-x')).toBe('10px');

    fireEvent.mouseLeave(link);
    expect(link.style.getPropertyValue('--magnet-x')).toBe('');
  });

  it('stays still on a touch screen', () => {
    stubMatchMedia([]);
    render(<MagneticLink />);
    const link = screen.getByRole('link');
    fireEvent.mouseMove(link, { clientX: 90, clientY: 45 });
    expect(link.style.getPropertyValue('--magnet-x')).toBe('');
  });
});
