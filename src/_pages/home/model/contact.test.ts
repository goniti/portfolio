import { describe, expect, it } from 'vitest';
import { buildContactMailto, calendlyEmbedUrl, createContactSchema } from './contact';

const schema = createContactSchema({
  nameTooShort: 'name',
  invalidEmail: 'email',
  messageTooShort: (missing) => `${missing} more`,
});

describe('createContactSchema', () => {
  it('accepts a complete message and trims it', () => {
    const result = schema.parse({
      name: ' Jane ',
      email: 'jane@company.com',
      message: 'Hello there!',
    });
    expect(result.name).toBe('Jane');
  });

  it('reports each invalid field with its copy', () => {
    const result = schema.safeParse({ name: 'J', email: 'nope', message: 'Hi' });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((issue) => issue.message);
    expect(messages).toEqual(['name', 'email', '8 more']);
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
