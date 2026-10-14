import { describe, expect, it } from 'vitest';
import { localizedFieldsOf, missingLocalesSubtitle } from './preview';

const item = (language: string, value: string) => ({ _key: `k-${language}`, language, value });
const both = [item('en', 'Hello'), item('fr', 'Bonjour')];
const englishOnly = [item('en', 'Hello')];

describe('missingLocalesSubtitle', () => {
  it('counts a blank value as missing', () => {
    expect(missingLocalesSubtitle([[item('en', 'Hello'), item('fr', ' ')]])).toBe('Missing: fr');
  });

  it('accepts a blank value when the field allows it, but not a missing locale', () => {
    const blankFrench = [item('en', '.'), item('fr', '')];
    expect(missingLocalesSubtitle([{ items: blankFrench, allowBlank: true }])).toBeUndefined();
    expect(missingLocalesSubtitle([{ items: englishOnly, allowBlank: true }])).toBe('Missing: fr');
  });

  it('ignores an optional field left out, but checks it once set', () => {
    expect(missingLocalesSubtitle([{ items: undefined, optional: true }])).toBeUndefined();
    expect(missingLocalesSubtitle([{ items: [], optional: true }])).toBeUndefined();
    expect(missingLocalesSubtitle([{ items: englishOnly, optional: true }])).toBe('Missing: fr');
  });

  it('flags a required field left out', () => {
    expect(missingLocalesSubtitle([both, { items: undefined }])).toBe('Missing: en, fr');
  });
});

describe('localizedFieldsOf', () => {
  it('reads the named fields of every object of an array', () => {
    const lines = [{ text: both }, { text: englishOnly }];
    expect(localizedFieldsOf(lines, 'text')).toEqual([both, englishOnly]);
    expect(missingLocalesSubtitle(localizedFieldsOf(lines, 'text'))).toBe('Missing: fr');
  });

  it('flags an object whose field is left out', () => {
    const practices = [{ title: both }];
    expect(missingLocalesSubtitle(localizedFieldsOf(practices, 'title', 'description'))).toBe(
      'Missing: en, fr',
    );
  });

  it('reads nothing from an absent array', () => {
    expect(localizedFieldsOf(undefined, 'text')).toEqual([]);
  });
});
