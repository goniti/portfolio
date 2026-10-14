import { describe, expect, it } from 'vitest';
import { LOCALE_OPTIONS, localeLabel } from './locales';

describe('localeLabel', () => {
  it('names a locale with its title and code', () => {
    expect(localeLabel('fr')).toBe('Français (fr)');
  });

  it('quotes an unknown code', () => {
    expect(localeLabel('de')).toBe('"de"');
  });
});

describe('LOCALE_OPTIONS', () => {
  it('lists every content locale for the plugin, default first', () => {
    expect(LOCALE_OPTIONS).toEqual([
      { id: 'en', title: 'English' },
      { id: 'fr', title: 'Français' },
    ]);
  });
});
