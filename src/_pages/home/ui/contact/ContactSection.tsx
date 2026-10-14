'use client';

import type { ReactNode } from 'react';
import * as Tabs from 'goniui/tabs';
import { Flex, Link, Text } from 'goniui';
import { useLocalized, useMessages } from '@/shared/lib/i18n';
import { mailtoHref } from '@/shared/lib/mailto';
import { REVEAL } from '@/shared/lib/motion';
import { useTheme } from '@/shared/lib/theme';
import { CARD_CURSOR_TARGET, Surface } from '@/shared/ui/atoms';
import { CopyButton } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import { PAST_HERO_VIEWPORTS } from '../../config/site';
import { calendlyEmbedUrl } from '../../model/contact';
import type { ContactContent, OwnerLinks } from '../../model/content';
import { CalendlyEmbed } from './CalendlyEmbed';
import { ContactForm } from './ContactForm';
import { contactMessages } from './messages';

/** Booking a call comes first: it is the quickest way to talk. */
const CONTACT_TABS = ['call', 'message'] as const;

interface ChannelItemProps {
  href: string;
  label: string;
  value: string;
  external: boolean;
  /** Actions shown right after the value (a copy button…), above the row's link. */
  children?: ReactNode;
}

/**
 * One direct channel: the whole row opens it (and the cursor outlines the whole row), its
 * actions sit next to the value.
 */
function ChannelItem({ href, label, value, external, children }: ChannelItemProps) {
  const copy = useMessages(contactMessages);
  return (
    <Flex
      as="li"
      align="center"
      {...CARD_CURSOR_TARGET}
      className="relative min-h-13 gap-3 rounded-2xl border border-border bg-chip px-4.5 text-foreground transition-colors hover:border-tint-indigo/45 hover:text-foreground-strong"
    >
      <Link
        href={href}
        kind={external ? 'external' : 'internal'}
        variant="unstyled"
        className="flex min-w-0 items-center gap-3 text-inherit after:absolute after:inset-0 after:rounded-2xl"
      >
        <Text
          as="span"
          variant="bodySm"
          className="w-17 flex-none font-mono text-2xs font-medium text-foreground-subtle"
        >
          {label}
        </Text>
        <Text as="span" variant="body" className="min-w-0 truncate font-medium text-inherit">
          {value}
        </Text>
        {external ? <span className="sr-only">{copy.newTab}</span> : null}
      </Link>
      {children}
      <span aria-hidden="true" className="ml-auto">
        {copy.external}
      </span>
    </Flex>
  );
}

export interface ContactSectionProps {
  contact: ContactContent;
  links: OwnerLinks;
  /** Calendly scheduling page (`https://calendly.com/<user>/<event>`); absent hides the "Book a call" tab. */
  calendlyUrl?: string;
}

/** Closing call to action: direct channels, the message form and, when configured, Calendly. */
export function ContactSection({ contact, links, calendlyUrl }: ContactSectionProps) {
  const localize = useLocalized();
  const copy = useMessages(contactMessages);
  const { theme } = useTheme();
  const calendlySrc = calendlyUrl ? calendlyEmbedUrl(calendlyUrl, theme) : null;

  return (
    <PageSection id="contact" labelledBy="contact-title" spacing="closing">
      <Surface
        fill="contact"
        radius="xl"
        {...REVEAL.columns}
        className="flex flex-wrap gap-10 p-5.5 md:p-10 lg:p-16"
      >
        <Flex direction="col" className="min-w-0 grow basis-90 gap-5">
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
            {localize(contact.title)}
          </Text>
          <Text variant="bodyLg" tone="muted" className="max-w-110 text-lg leading-relaxed">
            {localize(contact.lead)}
          </Text>
          <Flex as="ul" direction="col" gap="sm" aria-label={copy.channelsLabel} className="mt-1.5">
            <ChannelItem
              href={mailtoHref(links.email)}
              label={copy.channels.email.label}
              value={links.email}
              external={false}
            >
              <CopyButton
                value={links.email}
                label={copy.channels.email.copy}
                copiedLabel={copy.channels.email.copied}
                failedLabel={copy.channels.email.copyFailed}
              />
            </ChannelItem>
            {links.linkedin ? (
              <ChannelItem
                href={links.linkedin.url}
                label={copy.channels.linkedin.label}
                value={links.linkedin.name}
                external
              />
            ) : null}
            <ChannelItem
              href={links.github.url}
              label={copy.channels.github.label}
              value={links.github.handle}
              external
            />
          </Flex>
        </Flex>
        <Flex direction="col" gap="md" className="min-w-0 grow basis-90">
          {calendlySrc ? (
            <Tabs.Root variant="segment" defaultValue="call" className="flex flex-col gap-3">
              <Tabs.List className="bg-chip">
                {CONTACT_TABS.map((tab) => (
                  <Tabs.Trigger key={tab} value={tab} className="min-h-11 text-sm">
                    {copy.tabs[tab]}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {/* Both panels stay mounted: switching tabs never reloads Calendly nor clears the form. */}
              <Tabs.Content value="call" forceMount className="mt-0 data-[state=inactive]:hidden">
                <CalendlyEmbed
                  src={calendlySrc}
                  title={copy.calendlyTitle}
                  loadingLabel={copy.calendlyLoading}
                  loadAfterViewports={PAST_HERO_VIEWPORTS}
                />
              </Tabs.Content>
              <Tabs.Content
                value="message"
                forceMount
                className="mt-0 data-[state=inactive]:hidden"
              >
                <ContactForm recipient={links.email} />
              </Tabs.Content>
            </Tabs.Root>
          ) : (
            <ContactForm recipient={links.email} />
          )}
        </Flex>
      </Surface>
    </PageSection>
  );
}
