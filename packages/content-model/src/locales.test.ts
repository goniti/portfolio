import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, isLocale, LOCALES } from './locales';

describe('isLocale', () => {
  it('accepts every content locale', () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isLocale('de')).toBe(false);
    expect(isLocale('EN')).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(1)).toBe(false);
  });

  it('defaults to a content locale', () => {
    expect(isLocale(DEFAULT_LOCALE)).toBe(true);
  });
});
