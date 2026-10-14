import { describe, expect, it } from 'vitest';
import { mailtoHref } from './mailtoHref';

describe('mailtoHref', () => {
  it('links to a blank message to the address', () => {
    expect(mailtoHref('me@site.dev')).toBe('mailto:me@site.dev');
    expect(mailtoHref('me@site.dev', { subject: '', body: '' })).toBe('mailto:me@site.dev');
  });

  it('prefills the subject and the body, encoded', () => {
    expect(mailtoHref('me@site.dev', { subject: 'Hello & welcome', body: 'Line 1\nLine 2' })).toBe(
      'mailto:me@site.dev?subject=Hello%20%26%20welcome&body=Line%201%0ALine%202',
    );
  });

  it('prefills a single field', () => {
    expect(mailtoHref('me@site.dev', { subject: 'Hi' })).toBe('mailto:me@site.dev?subject=Hi');
  });
});
