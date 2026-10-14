import { describe, expect, it } from 'vitest';
import { formatIndex, formatLocation, formatMonthYear, formatPeriod } from './format';

describe('formatLocation', () => {
  const lyon = { locality: 'Lyon', country: 'FR', remote: true };

  it('names the place, its country in the locale, then the remote mention', () => {
    expect(formatLocation(lyon, 'en', 'Remote')).toBe('Lyon, France · Remote');
    expect(formatLocation(lyon, 'fr', 'Télétravail')).toBe('Lyon, France · Télétravail');
  });

  it('translates the country name', () => {
    expect(formatLocation({ ...lyon, country: 'DE' }, 'fr', 'Télétravail')).toBe(
      'Lyon, Allemagne · Télétravail',
    );
  });

  it('leaves out the remote mention for on-site work', () => {
    expect(formatLocation({ ...lyon, remote: false }, 'en', 'Remote')).toBe('Lyon, France');
  });
});

describe('formatIndex', () => {
  it('pads to two digits, with an optional offset', () => {
    expect(formatIndex(0)).toBe('00');
    expect(formatIndex(0, 1)).toBe('01');
    expect(formatIndex(11)).toBe('11');
  });
});

describe('formatMonthYear', () => {
  it.each([
    ['2024-07-01', 'Jul 2024', 'Juil. 2024'],
    ['2026-09-01', 'Sep 2026', 'Sept. 2026'],
    ['2026-08-31', 'Aug 2026', 'Août 2026'],
    ['2022-01-01', 'Jan 2022', 'Janv. 2022'],
  ])('formats %s', (isoDate, english, french) => {
    expect(formatMonthYear(isoDate, 'en')).toBe(english);
    expect(formatMonthYear(isoDate, 'fr')).toBe(french);
  });
});

describe('formatPeriod', () => {
  it('formats a closed period', () => {
    expect(formatPeriod('2022-01-01', '2024-06-01', 'fr', 'Aujourd’hui')).toBe(
      'Janv. 2022 — Juin 2024',
    );
  });

  it('ends an open period on the "present" label', () => {
    expect(formatPeriod('2024-07-01', null, 'en', 'Present')).toBe('Jul 2024 — Present');
  });
});
