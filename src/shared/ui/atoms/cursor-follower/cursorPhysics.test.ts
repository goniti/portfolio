import { describe, expect, it } from 'vitest';
import {
  classifyHoverTarget,
  DOT_SIZE,
  MAGNET_PADDING,
  RING_SIZE,
  shapeAround,
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
});
