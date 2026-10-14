import { describe, expect, it } from 'vitest';
import { mailtoHref } from './mailtoHref';

describe('mailtoHref', () => {
  it('links to a blank message to the address', () => {
    expect(mailtoHref('me@site.dev')).toBe('mailto:me@site.dev');
  });
});
