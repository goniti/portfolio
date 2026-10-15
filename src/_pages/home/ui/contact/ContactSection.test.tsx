import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubMatchMedia } from '@/shared/lib/testing';
import { CALENDLY_URL_FIXTURE, HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ContactSection } from './ContactSection';
const { contact, site } = HOME_CONTENT_FIXTURE;

describe('ContactSection', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => vi.unstubAllGlobals());

  it('offers the "Book a call" tab first when a Calendly page is set', () => {
    render(
      <ContactSection contact={contact} links={site.links} calendlyUrl={CALENDLY_URL_FIXTURE} />,
    );
    const tabs = screen.getAllByRole('tab').map((tab) => tab.textContent);
    expect(tabs).toEqual(['Book a call', 'Send a message']);
  });

  it.each([undefined, '', 'https://example.com/not-calendly'])(
    'hides the "Book a call" tab with the Calendly page %j',
    (calendlyUrl) => {
      render(<ContactSection contact={contact} links={site.links} calendlyUrl={calendlyUrl} />);
      expect(screen.queryByRole('tab')).toBeNull();
      expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy();
    },
  );

  it('links the email channel to a blank message', () => {
    render(<ContactSection contact={contact} links={site.links} />);
    const emailLink = screen.getByRole('link', {
      name: (name) => name.includes(site.links.email),
    });
    expect(emailLink.getAttribute('href')).toBe(`mailto:${site.links.email}`);
  });
});
