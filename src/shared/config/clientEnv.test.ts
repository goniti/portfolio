import { describe, expect, it } from 'vitest';
import { loadClientEnv } from './clientEnv';

describe('loadClientEnv', () => {
  it('applies defaults', () => {
    expect(loadClientEnv({})).toEqual({
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_BASE_PATH: '',
      NEXT_PUBLIC_CALENDLY_URL: undefined,
    });
  });

  it('accepts a Calendly scheduling page', () => {
    const url = 'https://calendly.com/carlos/intro';
    expect(loadClientEnv({ NEXT_PUBLIC_CALENDLY_URL: url }).NEXT_PUBLIC_CALENDLY_URL).toBe(url);
  });

  it('treats an empty Calendly URL as unset', () => {
    expect(
      loadClientEnv({ NEXT_PUBLIC_CALENDLY_URL: '' }).NEXT_PUBLIC_CALENDLY_URL,
    ).toBeUndefined();
  });

  it.each([
    'https://example.com/carlos/intro',
    'http://calendly.com/carlos',
    'https://calendly.com/',
    'calendly',
  ])('rejects the Calendly URL %j', (url) => {
    expect(() => loadClientEnv({ NEXT_PUBLIC_CALENDLY_URL: url })).toThrow(
      /NEXT_PUBLIC_CALENDLY_URL/,
    );
  });

  it('rejects an invalid base path', () => {
    expect(() => loadClientEnv({ NEXT_PUBLIC_BASE_PATH: '/portfolio/' })).toThrow(
      /NEXT_PUBLIC_BASE_PATH/,
    );
  });
});
