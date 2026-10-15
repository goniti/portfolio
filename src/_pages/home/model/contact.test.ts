import { describe, expect, it } from 'vitest';
import type { ResolverOptions } from 'react-hook-form';
import {
  buildContactMailto,
  calendlyEmbedUrl,
  createContactResolver,
  validateContact,
  type ContactValues,
} from './contact';

const copy = {
  nameTooShort: 'name',
  invalidEmail: 'email',
  messageTooShort: (missing: number) => `${missing} more`,
};

const VALID: ContactValues = { name: 'Jane', email: 'jane@company.com', message: 'Hello there!' };

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(VALID, copy)).toEqual({});
  });

  it('reports each invalid field with its copy', () => {
    expect(validateContact({ name: 'J', email: 'nope', message: 'Hi' }, copy)).toEqual({
      name: 'name',
      email: 'email',
      message: '8 more',
    });
  });

  it.each(['jane@company', 'jane@@company.com', '.jane@company.com', 'jane..doe@company.com'])(
    'rejects the email %j',
    (email) => {
      expect(validateContact({ ...VALID, email }, copy).email).toBe('email');
    },
  );

  it.each(['jane.doe+work@company.co.uk', "o'neil@mail.company.dev"])(
    'accepts the email %j',
    (email) => {
      expect(validateContact({ ...VALID, email }, copy)).toEqual({});
    },
  );
});

describe('createContactResolver', () => {
  const resolve = createContactResolver(copy);
  const options: ResolverOptions<ContactValues> = {
    fields: {},
    shouldUseNativeValidation: undefined,
  };

  it('trims the values it accepts', async () => {
    const result = await resolve(
      { name: ' Jane ', email: ' jane@company.com ', message: ' Hello there! ' },
      undefined,
      options,
    );
    expect(result).toEqual({ values: VALID, errors: {} });
  });

  it('validates the trimmed values', async () => {
    const result = await resolve({ ...VALID, name: ' J ' }, undefined, options);
    expect(result).toEqual({ values: {}, errors: { name: { type: 'validate', message: 'name' } } });
  });
});

describe('buildContactMailto', () => {
  it('encodes the subject and the signed body', () => {
    const href = buildContactMailto('me@site.dev', 'Hello & welcome', {
      name: 'Jane',
      email: 'jane@company.com',
      message: 'Line one',
    });
    expect(href.startsWith('mailto:me@site.dev?')).toBe(true);
    const query = new URLSearchParams(href.split('?')[1]);
    expect(query.get('subject')).toBe('Hello & welcome');
    expect(query.get('body')).toBe('Line one\n\n— Jane <jane@company.com>');
    expect(href).not.toContain('+');
  });
});

describe('calendlyEmbedUrl', () => {
  it('is null without a Calendly page', () => {
    expect(calendlyEmbedUrl('', 'dark')).toBeNull();
    expect(calendlyEmbedUrl('https://example.com/meet', 'dark')).toBeNull();
  });

  it('themes the embed', () => {
    const url = new URL(calendlyEmbedUrl('https://calendly.com/carlos/intro', 'light') ?? '');
    expect(url.searchParams.get('embed_type')).toBe('Inline');
    expect(url.searchParams.get('background_color')).toBe('ffffff');
  });
});
