'use client';

import * as Tabs from 'goniui/tabs';
import { Flex, Link, Text } from 'goniui';
import { useMessages } from '@/shared/lib/i18n';
import { useTheme } from '@/shared/lib/theme';
import { Surface } from '@/shared/ui/atoms';
import { PageSection } from '@/shared/ui/templates';
import { CALENDLY_URL, CONTACT_EMAIL, SITE_LINKS } from '../../config/site';
import { calendlyEmbedUrl } from '../../model/contact';
import { ContactForm } from './ContactForm';
import { contactMessages } from './messages';

interface ChannelLinkProps {
  href: string;
  label: string;
  value: string;
  external: boolean;
}

function ChannelLink({ href, label, value, external }: ChannelLinkProps) {
  const copy = useMessages(contactMessages);
  return (
    <Link
      href={href}
      kind={external ? 'external' : 'internal'}
      variant="unstyled"
      className="flex min-h-13 items-center gap-3 rounded-2xl border border-border bg-chip px-4.5 text-foreground hover:border-tint-indigo/45 hover:text-foreground-strong"
    >
      <Text
        as="span"
        variant="bodySm"
        className="w-17 flex-none font-mono text-2xs font-medium text-foreground-subtle"
      >
        {label}
      </Text>
      <Text as="span" variant="body" className="min-w-0 flex-1 truncate font-medium text-inherit">
        {value}
      </Text>
      <span aria-hidden="true">{copy.external}</span>
      {external ? <span className="sr-only">{copy.newTab}</span> : null}
    </Link>
  );
}

/** Closing call to action: direct channels, the message form and, when configured, Calendly. */
export function ContactSection() {
  const copy = useMessages(contactMessages);
  const { theme } = useTheme();
  const calendlySrc = calendlyEmbedUrl(CALENDLY_URL, theme);

  return (
    <PageSection id="contact" labelledBy="contact-title" spacing="closing">
      <Surface fill="contact" radius="xl" className="flex flex-wrap gap-10 p-5.5 md:p-10 lg:p-16">
        <Flex direction="col" gap="lg" className="min-w-0 grow basis-90 gap-5">
          <Text
            as="span"
            variant="bodySm"
            className="font-mono font-medium tracking-widest text-accent-cyan uppercase"
          >
            {copy.eyebrow}
          </Text>
          <Text
            as="h2"
            variant="display"
            id="contact-title"
            className="text-4xl leading-none font-extrabold tracking-tighter text-balance md:text-5xl lg:text-6xl"
          >
            {copy.title}
          </Text>
          <Text variant="bodyLg" tone="muted" className="max-w-110 text-lg leading-relaxed">
            {copy.lead}
          </Text>
          <Flex as="ul" direction="col" gap="sm" aria-label={copy.channelsLabel} className="mt-1.5">
            <li>
              <ChannelLink
                href={SITE_LINKS.email}
                label={copy.channels.email.label}
                value={CONTACT_EMAIL}
                external={false}
              />
            </li>
            {SITE_LINKS.linkedin ? (
              <li>
                <ChannelLink
                  href={SITE_LINKS.linkedin}
                  label={copy.channels.linkedin.label}
                  value={copy.channels.linkedin.value}
                  external
                />
              </li>
            ) : null}
            <li>
              <ChannelLink
                href={SITE_LINKS.github}
                label={copy.channels.github.label}
                value={copy.channels.github.value}
                external
              />
            </li>
          </Flex>
        </Flex>
        <Flex direction="col" gap="md" className="min-w-0 grow basis-90">
          {calendlySrc ? (
            <Tabs.Root variant="segment" defaultValue="message" className="flex flex-col gap-3">
              <Tabs.List className="bg-chip">
                {(['message', 'call'] as const).map((tab) => (
                  <Tabs.Trigger key={tab} value={tab} className="min-h-11 gap-2 text-sm">
                    <span className="font-mono text-xs opacity-80">{copy.tabs[tab].number}</span>
                    {copy.tabs[tab].label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              <Tabs.Content value="message" className="mt-0">
                <ContactForm />
              </Tabs.Content>
              <Tabs.Content value="call" className="mt-0">
                <iframe
                  src={calendlySrc}
                  title={copy.calendlyTitle}
                  className="h-160 w-full rounded-3xl border border-border bg-surface-form"
                />
              </Tabs.Content>
            </Tabs.Root>
          ) : (
            <ContactForm />
          )}
        </Flex>
      </Surface>
    </PageSection>
  );
}
