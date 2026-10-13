import { describe, expect, it } from 'vitest';
import { activeSection, scrollProgress } from './scrollSpy';

describe('scrollProgress', () => {
  it('maps the scroll position to 0 → 1', () => {
    expect(scrollProgress({ scrollTop: 0, scrollHeight: 2000, clientHeight: 1000 })).toBe(0);
    expect(scrollProgress({ scrollTop: 500, scrollHeight: 2000, clientHeight: 1000 })).toBe(0.5);
    expect(scrollProgress({ scrollTop: 1000, scrollHeight: 2000, clientHeight: 1000 })).toBe(1);
  });

  it('is 0 on a page that does not scroll', () => {
    expect(scrollProgress({ scrollTop: 0, scrollHeight: 800, clientHeight: 1000 })).toBe(0);
  });
});

describe('activeSection', () => {
  it('picks the last section above the activation line', () => {
    const tops = [
      { id: 'home', top: -900 },
      { id: 'experience', top: 100 },
      { id: 'skills', top: 700 },
    ] as const;
    expect(activeSection(tops, 1000)).toBe('experience');
  });

  it('falls back to the first section and skips missing ones', () => {
    const tops = [
      { id: 'home', top: 600 },
      { id: 'watch', top: null },
    ] as const;
    expect(activeSection(tops, 1000)).toBe('home');
  });
});
