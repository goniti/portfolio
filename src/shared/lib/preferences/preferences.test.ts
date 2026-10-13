import { afterEach, describe, expect, it, vi } from 'vitest';
import { preferenceKey, readPreference, writePreference } from './preferences';

describe('preferences', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('round-trips a value under the prefixed key', () => {
    writePreference('theme', 'light');
    expect(window.localStorage.getItem(preferenceKey('theme'))).toBe('light');
    expect(readPreference('theme')).toBe('light');
  });

  it('returns null when nothing is stored', () => {
    expect(readPreference('lang')).toBeNull();
  });

  it('survives a storage that throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => writePreference('theme', 'dark')).not.toThrow();
    expect(readPreference('theme')).toBeNull();
  });
});
