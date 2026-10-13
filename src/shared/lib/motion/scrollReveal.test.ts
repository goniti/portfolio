import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '../testing';
import {
  armScrollReveal,
  columnDirection,
  MAX_STAGGER_INDEX,
  planStagger,
  reveal,
  revealStagger,
  rowRanks,
} from './scrollReveal';

type IntersectionCallback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

/** Minimal IntersectionObserver double: records observed elements, lets the test fire entries. */
function stubIntersectionObserver() {
  const observed = new Set<Element>();
  let notify: IntersectionCallback = () => {};
  class FakeIntersectionObserver {
    constructor(callback: IntersectionCallback) {
      notify = callback;
    }
    observe(element: Element) {
      observed.add(element);
    }
    unobserve(element: Element) {
      observed.delete(element);
    }
    disconnect() {
      observed.clear();
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  return {
    observed,
    enter(element: Element) {
      notify([{ isIntersecting: true, target: element }]);
    },
  };
}

function placeAt(element: Element, top: number) {
  element.getBoundingClientRect = () => new DOMRect(0, top, 300, 200);
}

function buildPage() {
  const root = document.createElement('div');
  root.innerHTML = `
    <h2 data-reveal="self">Above the fold</h2>
    <h2 data-reveal="self">Heading</h2>
    <ul data-reveal="stagger">${'<li>item</li>'.repeat(MAX_STAGGER_INDEX + 3)}</ul>
  `;
  const [visibleHeading, heading, list] = Array.from(root.querySelectorAll('[data-reveal]'));
  if (!visibleHeading || !heading || !list) throw new Error('fixture is incomplete');
  placeAt(visibleHeading, 100);
  placeAt(heading, 2000);
  placeAt(list, 2400);
  return { root, visibleHeading, heading, list };
}

describe('armScrollReveal', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => vi.unstubAllGlobals());

  it('hides what is below the fold and leaves what is on screen alone', () => {
    const observer = stubIntersectionObserver();
    const { root, visibleHeading, heading, list } = buildPage();

    armScrollReveal(root);

    expect(visibleHeading.hasAttribute('data-reveal-state')).toBe(false);
    expect(heading.getAttribute('data-reveal-state')).toBe('pending');
    expect(list.getAttribute('data-reveal-state')).toBe('pending');
    expect(observer.observed.size).toBe(2);
  });

  it('reveals once on entering the viewport', () => {
    const observer = stubIntersectionObserver();
    const { root, heading } = buildPage();
    armScrollReveal(root);

    observer.enter(heading);

    expect(heading.getAttribute('data-reveal-state')).toBe('shown');
    expect(observer.observed.has(heading)).toBe(false);
  });

  it('numbers the children of a staggered group, capping the rank', () => {
    const observer = stubIntersectionObserver();
    const { root, list } = buildPage();
    armScrollReveal(root);

    observer.enter(list);

    const ranks = Array.from(list.children).map((child) =>
      child instanceof HTMLElement ? child.style.getPropertyValue('--reveal-index') : null,
    );
    expect(ranks[0]).toBe('0');
    expect(ranks[1]).toBe('1');
    expect(ranks.at(-1)).toBe(String(MAX_STAGGER_INDEX));
  });

  it('sends each card of a two-column grid in from its own side, row by row', () => {
    const observer = stubIntersectionObserver();
    const root = document.createElement('div');
    root.innerHTML = `<ul data-reveal="stagger" data-reveal-from="columns">${'<li>card</li>'.repeat(4)}</ul>`;
    const grid = root.querySelector('ul');
    if (!grid) throw new Error('fixture is incomplete');
    grid.getBoundingClientRect = () => new DOMRect(0, 2000, 1000, 600);
    Array.from(grid.children).forEach((card, cardIndex) => {
      card.getBoundingClientRect = () =>
        new DOMRect(
          cardIndex % 2 === 0 ? 0 : 510,
          2000 + Math.floor(cardIndex / 2) * 310,
          490,
          290,
        );
    });
    armScrollReveal(root);

    observer.enter(grid);

    const entrances = Array.from(grid.children).map((card) => [
      card.getAttribute('data-reveal-from'),
      card instanceof HTMLElement ? card.style.getPropertyValue('--reveal-index') : null,
    ]);
    expect(entrances).toEqual([
      ['left', '0'],
      ['right', '0'],
      ['left', '1'],
      ['right', '1'],
    ]);
  });

  it('un-hides what never revealed on cleanup', () => {
    stubIntersectionObserver();
    const { root, heading } = buildPage();
    const cleanup = armScrollReveal(root);

    cleanup();

    expect(heading.hasAttribute('data-reveal-state')).toBe(false);
  });

  it('does nothing with reduced motion', () => {
    stubIntersectionObserver();
    stubMatchMedia(['(prefers-reduced-motion: reduce)']);
    const { root, heading } = buildPage();

    armScrollReveal(root);

    expect(heading.hasAttribute('data-reveal-state')).toBe(false);
  });

  it('does nothing without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { root, heading } = buildPage();

    armScrollReveal(root);

    expect(heading.hasAttribute('data-reveal-state')).toBe(false);
  });
});

describe('reveal markers', () => {
  it('enters from below by default', () => {
    expect(reveal()).toEqual({ 'data-reveal': 'self', 'data-reveal-from': 'up' });
  });

  it('carries the direction and the zoom', () => {
    expect(revealStagger({ from: 'columns', zoom: true })).toEqual({
      'data-reveal': 'stagger',
      'data-reveal-from': 'columns',
      'data-reveal-zoom': true,
    });
  });
});

describe('columnDirection', () => {
  const container = { left: 100, width: 900 };

  it('sends the outer columns in from their side and the middle one from below', () => {
    const thirds = [100, 400, 700].map((left) => columnDirection({ left, width: 280 }, container));
    expect(thirds).toEqual(['left', 'up', 'right']);
  });

  it('treats a full-width child as a single column', () => {
    expect(columnDirection({ left: 100, width: 900 }, container)).toBe('up');
  });

  it('falls back to up for a container without width', () => {
    expect(columnDirection({ left: 0, width: 0 }, { left: 0, width: 0 })).toBe('up');
  });
});

describe('rowRanks', () => {
  it('groups boxes that overlap vertically into the same row', () => {
    const boxes = [0, 1, 300, 299.5, 600].map((top) => ({ top, height: 280 }));
    expect(rowRanks(boxes)).toEqual([0, 0, 1, 1, 2]);
  });

  it('keeps a bottom-aligned action on the row of the taller heading next to it', () => {
    const heading = { top: 0, height: 120 };
    const filters = { top: 80, height: 40 };
    const grid = { top: 160, height: 400 };
    expect(rowRanks([heading, filters, grid])).toEqual([0, 0, 1]);
  });
});

describe('planStagger', () => {
  const container = { left: 0, width: 1200 };

  it('plays a three-column row at once, from the left, below and the right', () => {
    const cards = [0, 400, 800, 0].map((left, cardIndex) => ({
      left,
      width: 380,
      top: cardIndex < 3 ? 0 : 420,
      height: 400,
    }));

    expect(planStagger('columns', cards, container)).toEqual([
      { from: 'left', rank: 0 },
      { from: 'up', rank: 0 },
      { from: 'right', rank: 0 },
      { from: 'left', rank: 1 },
    ]);
  });

  it('raises cards a row at a time with the rows pattern', () => {
    const cards = [0, 400, 800, 0].map((left, cardIndex) => ({
      left,
      width: 380,
      top: cardIndex < 3 ? 0 : 420,
      height: 400,
    }));

    expect(planStagger('rows', cards, container)).toEqual([
      { from: 'up', rank: 0 },
      { from: 'up', rank: 0 },
      { from: 'up', rank: 0 },
      { from: 'up', rank: 1 },
    ]);
  });

  it('drops children in from above, one after the other', () => {
    const notes = [0, 300, 600, 900].map((left) => ({ left, width: 280, top: 0, height: 300 }));

    expect(planStagger('down', notes, container).map((entrance) => entrance.from)).toEqual([
      'down',
      'down',
      'down',
      'down',
    ]);
    expect(planStagger('down', notes, container).map((entrance) => entrance.rank)).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it('falls back to up, one card after the other, on a single column', () => {
    const cards = [0, 320, 640].map((top) => ({ left: 0, width: 1200, top, height: 300 }));

    expect(planStagger('columns', cards, container)).toEqual([
      { from: 'up', rank: 0 },
      { from: 'up', rank: 1 },
      { from: 'up', rank: 2 },
    ]);
  });

  it('ranks children in order for a plain direction, capping the rank', () => {
    const items = Array.from({ length: MAX_STAGGER_INDEX + 2 }, () => ({
      left: 0,
      width: 10,
      top: 0,
      height: 10,
    }));

    const plan = planStagger('left', items, container);

    expect(plan.every((entrance) => entrance.from === 'left')).toBe(true);
    expect(plan.map((entrance) => entrance.rank).at(-1)).toBe(MAX_STAGGER_INDEX);
  });
});
