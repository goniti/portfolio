import { describe, expect, it } from 'vitest';
import { isRecord, optionalString, stringField } from './guards';

describe('isRecord', () => {
  it('accepts plain objects only', () => {
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord('text')).toBe(false);
  });
});

describe('optionalString', () => {
  it('keeps a string and drops anything else', () => {
    expect(optionalString('2026-10')).toBe('2026-10');
    expect(optionalString('')).toBe('');
    expect(optionalString(1)).toBeUndefined();
    expect(optionalString(undefined)).toBeUndefined();
  });
});

describe('stringField', () => {
  it('reads a string field of an object', () => {
    expect(stringField({ linkedinUrl: 'https://x.test' }, 'linkedinUrl')).toBe('https://x.test');
  });

  it('is undefined for a missing field, another type or a non-object', () => {
    expect(stringField({}, 'linkedinUrl')).toBeUndefined();
    expect(stringField({ linkedinUrl: 1 }, 'linkedinUrl')).toBeUndefined();
    expect(stringField(undefined, 'linkedinUrl')).toBeUndefined();
  });
});
