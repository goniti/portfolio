import { describe, expect, it } from 'vitest';
import { loadEnv } from './env';

describe('loadEnv', () => {
  const valid = { SANITY_PROJECT_ID: '8i6zw2b7' };

  it('applies defaults', () => {
    const env = loadEnv(valid);
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
    expect(env.NEXT_PUBLIC_BASE_PATH).toBe('');
    expect(env.SANITY_DATASET).toBe('production');
    expect(env.SANITY_API_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('rejects invalid values', () => {
    expect(() => loadEnv({ ...valid, NEXT_PUBLIC_SITE_URL: 'not a url' })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
  });

  it('accepts a base path such as "/portfolio"', () => {
    expect(loadEnv({ ...valid, NEXT_PUBLIC_BASE_PATH: '/portfolio' }).NEXT_PUBLIC_BASE_PATH).toBe(
      '/portfolio',
    );
  });

  it.each(['portfolio', '/portfolio/', '/', '/a b'])('rejects the base path %j', (basePath) => {
    expect(() => loadEnv({ ...valid, NEXT_PUBLIC_BASE_PATH: basePath })).toThrow(
      /NEXT_PUBLIC_BASE_PATH/,
    );
  });

  it.each(['development', 'production'])('requires the Sanity project ID in %s', (nodeEnv) => {
    expect(() => loadEnv({ NODE_ENV: nodeEnv })).toThrow(/SANITY_PROJECT_ID/);
  });

  it('accepts a Calendly scheduling page', () => {
    const url = 'https://calendly.com/carlos/intro';
    expect(loadEnv({ ...valid, NEXT_PUBLIC_CALENDLY_URL: url }).NEXT_PUBLIC_CALENDLY_URL).toBe(url);
  });

  it('treats an empty Calendly URL as unset', () => {
    expect(
      loadEnv({ ...valid, NEXT_PUBLIC_CALENDLY_URL: '' }).NEXT_PUBLIC_CALENDLY_URL,
    ).toBeUndefined();
  });

  it.each([
    'https://example.com',
    'https://example.com/carlos/intro',
    'http://calendly.com/carlos',
    'https://calendly.com/',
    'calendly',
  ])('rejects the Calendly URL %j', (url) => {
    expect(() => loadEnv({ ...valid, NEXT_PUBLIC_CALENDLY_URL: url })).toThrow(
      /NEXT_PUBLIC_CALENDLY_URL/,
    );
  });

  it('lets unit tests run without Sanity', () => {
    expect(loadEnv({ NODE_ENV: 'test' }).SANITY_PROJECT_ID).toBeUndefined();
  });

  it('rejects an unpinned API version', () => {
    expect(() => loadEnv({ ...valid, SANITY_API_VERSION: 'latest' })).toThrow(/SANITY_API_VERSION/);
  });

  it('treats an empty Sanity variable as unset', () => {
    const env = loadEnv({ ...valid, SANITY_DATASET: '', SANITY_API_VERSION: '' });
    expect(env.SANITY_DATASET).toBe('production');
    expect(env.SANITY_API_VERSION).toBe('2026-10-01');
    expect(() => loadEnv({ NODE_ENV: 'production', SANITY_PROJECT_ID: '' })).toThrow(
      /SANITY_PROJECT_ID/,
    );
  });
});
