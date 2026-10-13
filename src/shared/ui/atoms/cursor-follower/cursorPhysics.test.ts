import { describe, expect, it } from 'vitest';
import {
  CARD_CURSOR_TARGET,
  CARD_PADDING,
  classifyHoverTarget,
  OWN_CURSOR_TARGET,
  DOT_SIZE,
  MAGNET_PADDING,
  RING_SIZE,
  shapeAround,
  snapsOnExit,
  stepSpring,
  targetShape,
  ZERO_SHAPE,
} from './cursorPhysics';

function stubRect(element: Element, width: number, height: number) {
  element.getBoundingClientRect = () => new DOMRect(10, 20, width, height);
}

describe('stepSpring', () => {
  it('converges on the target', () => {
    const target = shapeAround({ x: 200, y: 100 }, DOT_SIZE);
    let state = { position: shapeAround({ x: 0, y: 0 }, DOT_SIZE), velocity: ZERO_SHAPE };
    for (let frame = 0; frame < 120; frame += 1) {
      state = stepSpring(state.position, state.velocity, target);
    }
    expect(state.position.x).toBeCloseTo(target.x, 1);
    expect(state.position.y).toBeCloseTo(target.y, 1);
  });

  it('stays put when already at rest on the target', () => {
    const resting = shapeAround({ x: 50, y: 50 }, DOT_SIZE);
    const next = stepSpring(resting, ZERO_SHAPE, resting);
    expect(next.position).toEqual(resting);
  });
});

describe('classifyHoverTarget', () => {
  it('shows the dot away from interactive elements', () => {
    expect(classifyHoverTarget(document.createElement('p')).mode).toBe('dot');
    expect(classifyHoverTarget(null).mode).toBe('dot');
  });

  it('wraps a small button', () => {
    const button = document.createElement('button');
    stubRect(button, 120, 40);
    const hover = classifyHoverTarget(button);
    expect(hover).toEqual({ mode: 'magnet', element: button });
  });

  it('uses the ring for large targets and text fields', () => {
    const link = document.createElement('a');
    stubRect(link, 600, 300);
    expect(classifyHoverTarget(link).mode).toBe('ring');

    const input = document.createElement('input');
    stubRect(input, 200, 40);
    expect(classifyHoverTarget(input).mode).toBe('ring');
  });

  it('always wraps an element opting into the pill, even a wide one', () => {
    const button = document.createElement('button');
    button.setAttribute('data-cursor', 'magnet');
    stubRect(button, 600, 52);
    expect(classifyHoverTarget(button)).toEqual({ mode: 'magnet', element: button });
  });

  it('outlines a card opting in, however large', () => {
    const card = document.createElement('article');
    card.setAttribute('data-cursor', CARD_CURSOR_TARGET['data-cursor']);
    stubRect(card, 380, 520);
    expect(classifyHoverTarget(card)).toEqual({ mode: 'card', element: card });
  });

  it('keeps the card outlined over its plain controls, but not over a magnetic one', () => {
    const card = document.createElement('li');
    card.setAttribute('data-cursor', CARD_CURSOR_TARGET['data-cursor']);
    const link = document.createElement('a');
    const label = document.createElement('span');
    link.append(label);
    const copyButton = document.createElement('button');
    const magneticButton = document.createElement('button');
    magneticButton.setAttribute('data-cursor', 'magnet');
    card.append(link, copyButton, magneticButton);
    stubRect(card, 520, 52);
    stubRect(magneticButton, 120, 40);

    expect(classifyHoverTarget(label)).toEqual({ mode: 'card', element: card });
    expect(classifyHoverTarget(copyButton)).toEqual({ mode: 'card', element: card });
    expect(classifyHoverTarget(magneticButton)).toEqual({
      mode: 'magnet',
      element: magneticButton,
    });
  });

  it('outlines a control opting into its own target, even inside a card', () => {
    const card = document.createElement('li');
    card.setAttribute('data-cursor', CARD_CURSOR_TARGET['data-cursor']);
    const copyButton = document.createElement('button');
    copyButton.setAttribute('data-cursor', OWN_CURSOR_TARGET['data-cursor']);
    const icon = document.createElement('svg');
    copyButton.append(icon);
    const link = document.createElement('a');
    card.append(link, copyButton);

    expect(classifyHoverTarget(icon)).toEqual({ mode: 'target', element: copyButton });
    expect(classifyHoverTarget(link)).toEqual({ mode: 'card', element: card });
  });

  it('finds the interactive ancestor', () => {
    const button = document.createElement('button');
    const label = document.createElement('span');
    button.append(label);
    stubRect(button, 80, 32);
    expect(classifyHoverTarget(label).element).toBe(button);
  });
});

describe('targetShape', () => {
  it('centres the dot and the ring on the pointer', () => {
    expect(
      targetShape({ x: 100, y: 100 }, { mode: 'dot', rect: null, borderRadius: 0 }).width,
    ).toBe(DOT_SIZE);
    const ring = targetShape({ x: 100, y: 100 }, { mode: 'ring', rect: null, borderRadius: 0 });
    expect(ring).toEqual(shapeAround({ x: 100, y: 100 }, RING_SIZE));
  });

  it('wraps the hovered element with padding, capping the radius', () => {
    const rect = new DOMRect(10, 20, 100, 40);
    const centre = { x: 60, y: 40 };
    const shape = targetShape(centre, { mode: 'magnet', rect, borderRadius: 999 });
    expect(shape).toEqual({
      x: 10 - MAGNET_PADDING,
      y: 20 - MAGNET_PADDING,
      width: 100 + MAGNET_PADDING * 2,
      height: 40 + MAGNET_PADDING * 2,
      radius: (40 + MAGNET_PADDING * 2) / 2,
    });
  });

  it('traces a card with its own corners, holding still whatever the pointer', () => {
    const rect = new DOMRect(10, 20, 380, 520);
    const corner = targetShape({ x: 12, y: 22 }, { mode: 'card', rect, borderRadius: 24 });
    const centre = targetShape({ x: 200, y: 280 }, { mode: 'card', rect, borderRadius: 24 });
    expect(corner).toEqual({
      x: 10 - CARD_PADDING,
      y: 20 - CARD_PADDING,
      width: 380 + CARD_PADDING * 2,
      height: 520 + CARD_PADDING * 2,
      radius: 24 + CARD_PADDING,
    });
    expect(centre).toEqual(corner);
  });
});

describe('snapsOnExit', () => {
  it('jumps straight back when leaving a card outline', () => {
    expect(snapsOnExit('card', 'dot')).toBe(true);
    expect(snapsOnExit('card', 'ring')).toBe(true);
    expect(snapsOnExit('card', 'magnet')).toBe(true);
  });

  it('keeps entering a card and moving from card to card springy', () => {
    expect(snapsOnExit('dot', 'card')).toBe(false);
    expect(snapsOnExit('card', 'card')).toBe(false);
    expect(snapsOnExit('magnet', 'dot')).toBe(false);
  });
});

describe('own target', () => {
  it('outlines the control snugly without leaning towards the pointer', () => {
    const rect = new DOMRect(10, 20, 36, 36);
    const atCorner = targetShape({ x: 11, y: 21 }, { mode: 'target', rect, borderRadius: 8 });
    const atCentre = targetShape({ x: 28, y: 38 }, { mode: 'target', rect, borderRadius: 8 });
    expect(atCorner).toEqual({
      x: 10 - MAGNET_PADDING,
      y: 20 - MAGNET_PADDING,
      width: 36 + MAGNET_PADDING * 2,
      height: 36 + MAGNET_PADDING * 2,
      radius: 8 + MAGNET_PADDING,
    });
    expect(atCentre).toEqual(atCorner);
  });

  it('snaps from the card onto the control, and springs back to the card', () => {
    expect(snapsOnExit('card', 'target')).toBe(true);
    expect(snapsOnExit('target', 'card')).toBe(false);
  });

  it('snaps from a control outside any card straight back to the dot', () => {
    expect(snapsOnExit('target', 'dot')).toBe(true);
    expect(snapsOnExit('target', 'ring')).toBe(true);
    expect(snapsOnExit('target', 'target')).toBe(false);
  });
});
