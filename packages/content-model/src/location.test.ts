import { describe, expect, it } from 'vitest';
import { COUNTRY_CODE_PATTERN } from './location';

describe('COUNTRY_CODE_PATTERN', () => {
  it('accepts a two-letter upper-case country code', () => {
    expect(COUNTRY_CODE_PATTERN.test('FR')).toBe(true);
  });

  it('rejects a country name, a lower-case or a three-letter code', () => {
    for (const value of ['France', 'fr', 'FRA', 'F', '']) {
      expect(COUNTRY_CODE_PATTERN.test(value)).toBe(false);
    }
  });
});
