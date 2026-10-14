import { findLocaleProblems } from 'portfolio-content-model';
import { describe, expect, it } from 'vitest';
import { toStudioError } from './localeMessages';
import { missingLocalesSubtitle } from './preview';
import { validateLocales } from './requireLocales';

const item = (language: string | undefined, value: string, key = `k-${language}`) => ({
  _key: key,
  language,
  value,
});

const studioErrors = (...args: Parameters<typeof findLocaleProblems>) =>
  findLocaleProblems(...args).map(toStudioError);

describe('toStudioError', () => {
  it('asks for the missing locale on the field', () => {
    expect(studioErrors([item('en', 'Hello')])).toEqual([
      { message: 'Français (fr) translation is required', path: [] },
    ]);
  });

  it('points a blank value at its item', () => {
    expect(studioErrors([item('en', ' '), item('fr', 'Bonjour')])).toEqual([
      { message: 'English (en) is empty', path: [{ _key: 'k-en' }, 'value'] },
    ]);
  });

  it('attaches an item problem to the field when the item has no key', () => {
    expect(studioErrors([{ language: 'en', value: '' }, item('fr', 'Bonjour')])).toEqual([
      { message: 'English (en) is empty', path: [] },
    ]);
  });

  it('names duplicate, unknown and legacy items', () => {
    expect(
      studioErrors([
        item('en', 'Hi'),
        item('en', 'Hello', 'k-en-2'),
        item('de', 'Hallo'),
        item(undefined, 'Salut', 'fr'),
      ]),
    ).toEqual([
      { message: 'English (en) is set twice', path: [{ _key: 'k-en-2' }] },
      { message: 'Unknown language "de"', path: [{ _key: 'k-de' }] },
      {
        message: 'Item without a language (legacy v4 format): remove it and add the language again',
        path: [{ _key: 'fr' }],
      },
      { message: 'Français (fr) translation is required', path: [] },
    ]);
  });
});

describe('validateLocales', () => {
  it('blocks publishing with one error per problem', () => {
    expect(validateLocales(undefined)).toEqual([
      { message: 'English (en) translation is required' },
      { message: 'Français (fr) translation is required' },
    ]);
  });

  it('accepts a complete field, and blank values when allowed', () => {
    expect(validateLocales([item('en', 'Hello'), item('fr', 'Bonjour')])).toBe(true);
    expect(validateLocales([item('en', '.'), item('fr', '')], { allowBlank: true })).toBe(true);
  });

  it('lets an optional field stay empty', () => {
    expect(validateLocales([], { optional: true })).toBe(true);
  });
});

describe('previews', () => {
  it('names the missing locales in the subtitle', () => {
    expect(missingLocalesSubtitle([[item('en', 'Hi')], null])).toBe('Missing: fr, en');
    expect(missingLocalesSubtitle([[item('en', 'Hi'), item('fr', 'Salut')]])).toBeUndefined();
  });
});
