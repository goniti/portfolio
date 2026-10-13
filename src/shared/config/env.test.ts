import { describe, expect, it } from 'vitest';
import { loadEnv } from './env';

describe('loadEnv', () => {
  it('applies defaults', () => {
    expect(loadEnv({}).NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
  });

  it('rejects invalid values', () => {
    expect(() => loadEnv({ NEXT_PUBLIC_SITE_URL: 'not a url' })).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});
