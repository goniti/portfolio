import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { localizedString, localizedText, optionalLocalizedString } from './localized';

const item = (language: string | undefined, value: string | null | undefined, key = language) => ({
  _key: key ?? 'legacy',
  language,
  value,
});

function problemsOf(schema: z.ZodType, input: unknown) {
  const result = schema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe('localizedString', () => {
  it('maps a complete field to one value per locale', () => {
    expect(localizedString().parse([item('en', 'Hello'), item('fr', 'Bonjour')])).toEqual({
      en: 'Hello',
      fr: 'Bonjour',
    });
  });

  it('ignores the stored order of the locales', () => {
    expect(localizedText().parse([item('fr', 'Bonjour'), item('en', 'Hello')])).toEqual({
      en: 'Hello',
      fr: 'Bonjour',
    });
  });

  it('reports a missing locale', () => {
    expect(problemsOf(localizedString(), [item('en', 'Hello')])).toEqual(['missing translation']);
  });

  it('reports a blank locale', () => {
    expect(problemsOf(localizedString(), [item('en', '  '), item('fr', 'Bonjour')])).toEqual([
      'empty translation',
    ]);
  });

  it('reports every locale of a missing field', () => {
    expect(problemsOf(localizedString(), null)).toEqual([
      'missing translation',
      'missing translation',
    ]);
  });

  it('reports a duplicate language', () => {
    expect(
      problemsOf(localizedString(), [
        item('en', 'Hi'),
        item('en', 'Hello', 'k2'),
        item('fr', 'Salut'),
      ]),
    ).toEqual(['language set twice']);
  });

  it('reports an unknown language', () => {
    expect(
      problemsOf(localizedString(), [item('en', 'Hi'), item('fr', 'Salut'), item('de', 'Hallo')]),
    ).toEqual(['unknown language "de"']);
  });

  it('reports a legacy v4 item, keyed by language without a `language` field', () => {
    expect(
      problemsOf(localizedString(), [{ _key: 'en', value: 'Hi' }, item('fr', 'Salut')]),
    ).toEqual(['item without a language (legacy v4 format)', 'missing translation']);
  });

  it('carries the locale and the other locale as fallback on a gap', () => {
    const result = localizedString().safeParse([item('en', 'Hello')]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([]);
    expect(result.error?.issues[0]).toMatchObject({
      params: { locale: 'fr', fallback: 'Hello' },
    });
  });

  it('accepts blank values when allowed, but still needs every locale', () => {
    expect(localizedString({ allowBlank: true }).parse([item('en', '.'), item('fr', '')])).toEqual({
      en: '.',
      fr: '',
    });
    expect(problemsOf(localizedString({ allowBlank: true }), [item('en', '.')])).toEqual([
      'missing translation',
    ]);
  });
});

describe('optionalLocalizedString', () => {
  it('is null when the field is left out', () => {
    expect(optionalLocalizedString().parse(null)).toBeNull();
    expect(optionalLocalizedString().parse([])).toBeNull();
  });

  it('needs every locale once it has a value', () => {
    expect(problemsOf(optionalLocalizedString(), [item('en', 'Hi')])).toEqual([
      'missing translation',
    ]);
  });
});
