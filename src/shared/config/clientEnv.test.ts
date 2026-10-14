import { afterEach, describe, expect, it, vi } from 'vitest';
import { clientEnv } from './clientEnv';

describe('clientEnv', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('applies defaults', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', undefined);
    vi.stubEnv('NEXT_PUBLIC_CALENDLY_URL', undefined);
    expect({ ...clientEnv }).toEqual({
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      NEXT_PUBLIC_BASE_PATH: '',
      NEXT_PUBLIC_CALENDLY_URL: undefined,
    });
  });

  it('treats an empty Calendly URL as unset', () => {
    vi.stubEnv('NEXT_PUBLIC_CALENDLY_URL', '');
    expect(clientEnv.NEXT_PUBLIC_CALENDLY_URL).toBeUndefined();
  });

  it('reads the public variables on access', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://goniti.github.io/portfolio');
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/portfolio');
    vi.stubEnv('NEXT_PUBLIC_CALENDLY_URL', 'https://calendly.com/carlos/intro');
    expect({ ...clientEnv }).toEqual({
      NEXT_PUBLIC_SITE_URL: 'https://goniti.github.io/portfolio',
      NEXT_PUBLIC_BASE_PATH: '/portfolio',
      NEXT_PUBLIC_CALENDLY_URL: 'https://calendly.com/carlos/intro',
    });
  });
});
