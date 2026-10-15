import { describe, expect, it } from 'vitest';
import { railFillEnd, railFillRatio, railPosition, railSpan } from './timelineRail';

/** Centres of four card headings, as measured from the top of the list (px). */
const CENTRES = [40, 140, 200, 260];

describe('railSpan', () => {
  it('runs from the first heading to the last', () => {
    expect(railSpan(CENTRES)).toEqual({ start: 40, length: 220 });
  });

  it('is empty without cards, or with a single one', () => {
    expect(railSpan([])).toEqual({ start: 0, length: 0 });
    expect(railSpan([30])).toEqual({ start: 30, length: 0 });
  });
});

describe('railFillEnd', () => {
  it('sits on the last open heading at the start of a step', () => {
    expect(railFillEnd(CENTRES, { activeStart: 0, fraction: 0 }, 2)).toBe(140);
    expect(railFillEnd(CENTRES, { activeStart: 0, fraction: 0 }, 1)).toBe(40);
  });

  it('moves towards the next heading as the step goes by', () => {
    expect(railFillEnd(CENTRES, { activeStart: 0, fraction: 0.5 }, 2)).toBe(170);
    expect(railFillEnd(CENTRES, { activeStart: 1, fraction: 0.25 }, 1)).toBe(155);
  });

  it('stops on the last heading once the last card is open', () => {
    expect(railFillEnd(CENTRES, { activeStart: 2, fraction: 1 }, 2)).toBe(260);
    expect(railFillEnd(CENTRES, { activeStart: 0, fraction: 0 }, 4)).toBe(260);
    expect(railFillEnd([], { activeStart: 0, fraction: 0 }, 1)).toBe(0);
  });
});

describe('railFillRatio', () => {
  it('is the share of the base line covered by the fill', () => {
    expect(railFillRatio(CENTRES, { activeStart: 0, fraction: 0 }, 1)).toBe(0);
    // Ends at 170 px, 130 px down a 220 px line.
    expect(railFillRatio(CENTRES, { activeStart: 0, fraction: 0.5 }, 2)).toBeCloseTo(130 / 220);
    expect(railFillRatio(CENTRES, { activeStart: 2, fraction: 1 }, 2)).toBe(1);
  });

  it('draws the whole rail when it has no length', () => {
    expect(railFillRatio([], { activeStart: 0, fraction: 0 }, 1)).toBe(1);
    expect(railFillRatio([12], { activeStart: 0, fraction: 0 }, 1)).toBe(1);
  });
});

describe('railPosition', () => {
  it('places each heading along the rail, which colours its dot', () => {
    const span = railSpan(CENTRES);
    expect(CENTRES.map((centre) => railPosition(centre, span))).toEqual([
      0,
      100 / 220,
      160 / 220,
      1,
    ]);
  });

  it('is 0 on a rail without length, and stays within the rail', () => {
    expect(railPosition(30, { start: 30, length: 0 })).toBe(0);
    expect(railPosition(500, railSpan(CENTRES))).toBe(1);
  });
});
