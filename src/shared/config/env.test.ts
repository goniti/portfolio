import { describe, expect, it } from 'vitest';
import { loadEnv } from './env';

describe('loadEnv', () => {
  it('applies defaults', () => {
    const env = loadEnv({});
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
    expect(env.NEXT_PUBLIC_BASE_PATH).toBe('');
  });

  it('rejects invalid values', () => {
    expect(() => loadEnv({ NEXT_PUBLIC_SITE_URL: 'not a url' })).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it('accepts a base path such as "/portfolio"', () => {
    expect(loadEnv({ NEXT_PUBLIC_BASE_PATH: '/portfolio' }).NEXT_PUBLIC_BASE_PATH).toBe(
      '/portfolio',
    );
  });

  it.each(['portfolio', '/portfolio/', '/', '/a b'])('rejects the base path %j', (basePath) => {
    expect(() => loadEnv({ NEXT_PUBLIC_BASE_PATH: basePath })).toThrow(/NEXT_PUBLIC_BASE_PATH/);
  });
});
