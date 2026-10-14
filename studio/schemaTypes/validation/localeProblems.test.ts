import { describe, expect, it } from 'vitest';
import { findLocaleProblems, localizedValue, missingLanguages } from './localeProblems';
import { validateLocales } from './requireLocales';
import { missingLocalesSubtitle } from './preview';

const item = (language: string | undefined, value: string, key = `k-${language}`) => ({
  _key: key,
  language,
  value,
});

describe('findLocaleProblems', () => {
  it('accepts a field with every locale', () => {
    expect(findLocaleProblems([item('en', 'Hello'), item('fr', 'Bonjour')])).toEqual([]);
  });

  it('asks for the missing locale on the field', () => {
    expect(findLocaleProblems([item('en', 'Hello')])).toEqual([
      { message: 'Français (fr) translation is required', path: [] },
    ]);
  });

  it('points a blank value at its item', () => {
    expect(findLocaleProblems([item('en', ' '), item('fr', 'Bonjour')])).toEqual([
      { message: 'English (en) is empty', path: [{ _key: 'k-en' }, 'value'] },
    ]);
  });

  it('accepts blank values when allowed', () => {
    expect(findLocaleProblems([item('en', '.'), item('fr', '')], { allowBlank: true })).toEqual([]);
  });

  it('rejects duplicate, unknown and legacy items', () => {
    const problems = findLocaleProblems([
      item('en', 'Hi'),
      item('en', 'Hello', 'k-en-2'),
      item('de', 'Hallo'),
      item(undefined, 'Salut', 'fr'),
    ]).map((problem) => problem.message);
    expect(problems).toEqual([
      'English (en) is set twice',
      'Unknown language "de"',
      'Item without a language (legacy v4 format): remove it and add the language again',
      'Français (fr) translation is required',
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

  it('lets an optional field stay empty', () => {
    expect(validateLocales([], { optional: true })).toBe(true);
  });
});

describe('previews', () => {
  it('names the missing locales in the subtitle', () => {
    expect(missingLanguages([item('en', 'Hi')])).toEqual(['fr']);
    expect(missingLocalesSubtitle([[item('en', 'Hi')], null])).toBe('Missing: fr, en');
    expect(missingLocalesSubtitle([[item('en', 'Hi'), item('fr', 'Salut')]])).toBeUndefined();
  });

  it('reads the title from the English value', () => {
    expect(localizedValue([item('fr', 'Salut'), item('en', 'Hi')])).toBe('Hi');
  });
});
