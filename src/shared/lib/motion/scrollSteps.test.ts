import { describe, expect, it } from 'vitest';
import {
  clampOpenCount,
  itemPhase,
  itemStep,
  scrollStepAt,
  scrollStepCount,
  stepRevealing,
  stepScrollTop,
} from './scrollSteps';

describe('scrollStepCount', () => {
  it('counts the positions of the open window: N − K + 1', () => {
    expect(scrollStepCount(4, 2)).toBe(3);
    expect(scrollStepCount(4, 1)).toBe(4);
    expect(scrollStepCount(4, 4)).toBe(1);
  });

  it('keeps one step when the window is wider than the list, or the list is empty', () => {
    expect(scrollStepCount(1, 2)).toBe(1);
    expect(scrollStepCount(0, 2)).toBe(1);
  });
});

describe('clampOpenCount', () => {
  it('opens at least one item and at most every item', () => {
    expect(clampOpenCount(4, 2)).toBe(2);
    expect(clampOpenCount(1, 2)).toBe(1);
    expect(clampOpenCount(4, 0)).toBe(1);
  });
});

describe('scrollStepAt', () => {
  it('starts on the first step', () => {
    expect(scrollStepAt(0, 4, 2)).toEqual({ activeStart: 0, fraction: 0 });
  });

  it('moves the window one item per step, with the progress through the step', () => {
    const position = scrollStepAt(0.5, 4, 2);
    expect(position.activeStart).toBe(1);
    expect(position.fraction).toBeCloseTo(0.5);
    expect(scrollStepAt(0.8, 4, 1)).toEqual({ activeStart: 3, fraction: expect.closeTo(0.2) });
  });

  it('ends on the last step, fully through it', () => {
    expect(scrollStepAt(1, 4, 2)).toEqual({ activeStart: 2, fraction: 1 });
  });

  it('clamps a progress out of range (overscroll)', () => {
    expect(scrollStepAt(-0.3, 4, 2)).toEqual({ activeStart: 0, fraction: 0 });
    expect(scrollStepAt(1.4, 4, 2)).toEqual({ activeStart: 2, fraction: 1 });
  });
});

describe('itemStep', () => {
  it('opens an item on its own step, the last ones on the last step', () => {
    expect(itemStep(1, 3)).toBe(1);
    expect(itemStep(3, 3)).toBe(2);
    expect(itemStep(-1, 3)).toBe(0);
  });
});

describe('itemPhase', () => {
  it('places each item before, inside or after the open window', () => {
    expect([0, 1, 2, 3].map((itemIndex) => itemPhase(itemIndex, 1, 2))).toEqual([
      'past',
      'open',
      'open',
      'future',
    ]);
  });
});

describe('stepScrollTop', () => {
  const geometry = { trackTop: 1000, trackHeight: 3000, viewportHeight: 1000 };

  it('lands a fifth of the way into the step', () => {
    expect(stepScrollTop(0, 4, geometry)).toBeCloseTo(1100);
    expect(stepScrollTop(2, 4, geometry)).toBeCloseTo(2100);
  });

  it('sends an item past the last step to the last step', () => {
    expect(stepScrollTop(9, 4, geometry)).toBeCloseTo(stepScrollTop(3, 4, geometry));
  });

  it('stays on the track top when the track fits in the viewport', () => {
    expect(stepScrollTop(1, 2, { ...geometry, trackHeight: 800 })).toBe(1000);
  });
});

describe('stepRevealing', () => {
  // Four items, two open at a time: steps 0 to 2.
  it('makes an item after the window its last open item, moving one step only', () => {
    expect(stepRevealing(2, 0, 2, 3)).toBe(1);
    expect(stepRevealing(3, 0, 2, 3)).toBe(2);
    expect(stepRevealing(3, 0, 1, 4)).toBe(3);
  });

  it('makes an item before the window its first open item', () => {
    expect(stepRevealing(0, 2, 2, 3)).toBe(0);
    expect(stepRevealing(1, 2, 2, 3)).toBe(1);
  });

  it('leaves the scroll alone for an open item', () => {
    expect(stepRevealing(0, 0, 2, 3)).toBeNull();
    expect(stepRevealing(1, 0, 2, 3)).toBeNull();
    expect(stepRevealing(2, 1, 2, 3)).toBeNull();
  });
});
