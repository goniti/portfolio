import { describe, expect, it } from 'vitest';
import {
  fallbackValue,
  findLocaleProblems,
  localizedValue,
  missingLocales,
  type LocalizedItem,
} from './localeProblems';

const item = (language: string | undefined, value: unknown, key = `k-${language}`) => ({
  _key: key,
  language,
  value,
});

const both: LocalizedItem[] = [item('en', 'Hello'), item('fr', 'Bonjour')];

describe('findLocaleProblems', () => {
  it('accepts a field with every locale', () => {
    expect(findLocaleProblems(both)).toEqual([]);
  });

  it('ignores the stored order of the locales', () => {
    expect(findLocaleProblems([item('fr', 'Bonjour'), item('en', 'Hello')])).toEqual([]);
  });

  it('reports a missing locale', () => {
    expect(findLocaleProblems([item('en', 'Hello')])).toEqual([
      { kind: 'missing-locale', locale: 'fr' },
    ]);
  });

  it('reports every locale of an absent field', () => {
    const everyLocale = [
      { kind: 'missing-locale', locale: 'en' },
      { kind: 'missing-locale', locale: 'fr' },
    ];
    expect(findLocaleProblems(null)).toEqual(everyLocale);
    expect(findLocaleProblems(undefined)).toEqual(everyLocale);
    expect(findLocaleProblems([])).toEqual(everyLocale);
  });

  it('reports a blank value with its item key', () => {
    expect(findLocaleProblems([item('en', ' '), item('fr', 'Bonjour')])).toEqual([
      { kind: 'blank-value', itemKey: 'k-en', locale: 'en' },
    ]);
  });

  it('counts a non-string value as blank', () => {
    expect(findLocaleProblems([item('en', null), item('fr', 1)])).toEqual([
      { kind: 'blank-value', itemKey: 'k-en', locale: 'en' },
      { kind: 'blank-value', itemKey: 'k-fr', locale: 'fr' },
    ]);
  });

  it('accepts blank values when allowed, but still needs every locale', () => {
    expect(findLocaleProblems([item('en', '.'), item('fr', '')], { allowBlank: true })).toEqual([]);
    expect(findLocaleProblems([item('en', '.')], { allowBlank: true })).toEqual([
      { kind: 'missing-locale', locale: 'fr' },
    ]);
  });

  it('reports a duplicate locale', () => {
    expect(findLocaleProblems([...both, item('en', 'Hi', 'k-en-2')])).toEqual([
      { kind: 'duplicate-locale', itemKey: 'k-en-2', locale: 'en' },
    ]);
  });

  it('reports a duplicate after a blank value as a duplicate, not as a fix', () => {
    expect(
      findLocaleProblems([item('en', ''), item('en', 'Hello', 'k-en-2'), item('fr', 'Salut')]),
    ).toEqual([
      { kind: 'blank-value', itemKey: 'k-en', locale: 'en' },
      { kind: 'duplicate-locale', itemKey: 'k-en-2', locale: 'en' },
    ]);
  });

  it('reports an unknown language', () => {
    expect(findLocaleProblems([...both, item('de', 'Hallo')])).toEqual([
      { kind: 'unknown-language', itemKey: 'k-de', language: 'de' },
    ]);
  });

  it('reports a legacy v4 item, keyed by locale without a `language` field', () => {
    expect(findLocaleProblems([{ _key: 'en', value: 'Hi' }, item('fr', 'Salut')])).toEqual([
      { kind: 'no-language', itemKey: 'en' },
      { kind: 'missing-locale', locale: 'en' },
    ]);
  });

  it('leaves the item key out when the item has none', () => {
    expect(findLocaleProblems([{ language: 'en', value: '' }, item('fr', 'Salut')])).toEqual([
      { kind: 'blank-value', itemKey: undefined, locale: 'en' },
    ]);
  });

  it('lists item problems in order, then the missing locales', () => {
    const kinds = findLocaleProblems([
      item('en', 'Hi'),
      item('en', 'Hello', 'k-en-2'),
      item('de', 'Hallo'),
      item(undefined, 'Salut', 'fr'),
    ]).map((problem) => problem.kind);
    expect(kinds).toEqual([
      'duplicate-locale',
      'unknown-language',
      'no-language',
      'missing-locale',
    ]);
  });
});

describe('missingLocales', () => {
  it('lists the blank and absent locales once each', () => {
    expect(missingLocales([item('en', 'Hi')])).toEqual(['fr']);
    expect(missingLocales([item('en', 'Hi'), item('fr', ' ')])).toEqual(['fr']);
    expect(missingLocales([item('fr', ''), item('fr', 'Salut', 'k-fr-2')])).toEqual(['en', 'fr']);
    expect(missingLocales(null)).toEqual(['en', 'fr']);
    expect(missingLocales(both)).toEqual([]);
  });

  it('lists the locales in locale order, whatever the problem order', () => {
    expect(missingLocales([item('fr', ' ')])).toEqual(['en', 'fr']);
  });

  it('accepts a blank value when the field allows it', () => {
    expect(missingLocales([item('en', '.'), item('fr', '')], { allowBlank: true })).toEqual([]);
  });
});

describe('localizedValue', () => {
  it('reads the default locale whatever the stored order', () => {
    expect(localizedValue([item('fr', 'Salut'), item('en', 'Hi')])).toBe('Hi');
  });

  it('reads the given locale', () => {
    expect(localizedValue(both, 'fr')).toBe('Bonjour');
  });

  it('has no value for an absent locale or a non-string value', () => {
    expect(localizedValue([item('fr', 'Salut')])).toBeUndefined();
    expect(localizedValue([item('en', 1)])).toBeUndefined();
    expect(localizedValue(undefined)).toBeUndefined();
  });
});

describe('fallbackValue', () => {
  it('takes the first non-blank value in locale order', () => {
    expect(fallbackValue([item('fr', 'Bonjour'), item('en', 'Hello')])).toBe('Hello');
    expect(fallbackValue([item('en', ' '), item('fr', 'Bonjour')])).toBe('Bonjour');
  });

  it('reads the first item of each locale only', () => {
    expect(fallbackValue([item('en', ''), item('en', 'Hello', 'k-en-2')])).toBeUndefined();
  });

  it('ignores unknown languages and has none without a usable value', () => {
    expect(fallbackValue([item('de', 'Hallo')])).toBeUndefined();
    expect(fallbackValue(null)).toBeUndefined();
  });
});
