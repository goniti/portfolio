'use client';

import { Box, Flex, Link, Text } from 'goniui';
import { useLocale, useLocalized, useMessages } from '@/shared/lib/i18n';
import { mailtoHref } from '@/shared/lib/mailto';
import { CtaButton, PulseDot } from '@/shared/ui/atoms';
import { CLOCK_TIME_ZONE, TYPE_SPEED_MS } from '../../config/site';
import type { HeroContent, OwnerLinks, Person } from '../../model/content';
import { formatLocation } from '../../model/format';
import { buildTerminalScript } from '../../model/terminal';
import { useClock } from '../../model/useClock';
import { useTypewriter } from '../../model/useTypewriter';
import { heroMessages } from './messages';
import { TerminalCard } from './TerminalCard';

const SOCIAL_LINK_CLASS =
  'flex h-11 items-center rounded-lg px-3 font-mono text-xs font-medium text-foreground-muted hover:text-foreground-strong';

const HEADING_CLASS =
  'text-4xl leading-display font-extrabold tracking-tighter text-balance md:text-5xl lg:text-6xl';

export interface HeroSectionProps {
  hero: HeroContent;
  /** Absent until the owner fills it in the Studio: the tagline then stays the heading. */
  person: Person | null;
  links: OwnerLinks;
}

/** Opening section: who and where, pitch, calls to action and the live terminal card. */
export function HeroSection({ hero, person, links }: HeroSectionProps) {
  const { locale } = useLocale();
  const localize = useLocalized();
  const copy = useMessages(heroMessages);
  const { terminal } = copy;
  const lines = useTypewriter(
    buildTerminalScript(hero.terminalScript.map((line) => localize(line))),
    TYPE_SPEED_MS,
  );
  const clock = useClock(CLOCK_TIME_ZONE);
  const tagline = (
    <>
      {localize(hero.titleStart)}
      <span className="text-sheen motion-safe:animate-sheen">{localize(hero.titleHighlight)}</span>
      {localize(hero.titleEnd)}
    </>
  );

  return (
    <Box
      as="section"
      id="home"
      aria-labelledby="home-title"
      className="relative mx-auto max-w-300 px-5 pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      <Flex align="center" wrap="wrap" className="gap-14">
        <Flex direction="col" className="min-w-0 grow basis-130 gap-6.5">
          <Text
            as="span"
            variant="bodySm"
            className="inline-flex items-center gap-2.5 self-start rounded-full border border-tint-indigo/30 bg-tint-indigo-strong/10 py-1.5 pr-3.5 pl-2.5 font-medium font-mono text-accent-indigo"
          >
            <PulseDot />
            {person ? formatLocation(person.location, locale, copy.remote) : localize(hero.badge)}
          </Text>
          {person ? (
            <>
              <Text as="h1" variant="display" id="home-title" className={HEADING_CLASS}>
                {person.fullName}
                {copy.titleSeparator}
                {localize(person.jobTitle)}
              </Text>
              <Text
                as="p"
                variant="title"
                className="text-balance text-2xl leading-heading tracking-tighter md:text-3xl"
              >
                {tagline}
              </Text>
            </>
          ) : (
            <Text as="h1" variant="display" id="home-title" className={HEADING_CLASS}>
              {tagline}
            </Text>
          )}
          <Text
            variant="bodyLg"
            tone="muted"
            className="max-w-145 text-pretty text-lg leading-relaxed"
          >
            {localize(hero.lead)}
          </Text>
          <Flex align="center" wrap="wrap" gap="md">
            <CtaButton asChild>
              <a href="#projects">
                {copy.exploreWork}
                <span aria-hidden="true">{copy.arrow}</span>
              </a>
            </CtaButton>
            <CtaButton asChild tone="outline" className="px-5.5">
              <a href="#contact">{copy.getInTouch}</a>
            </CtaButton>
            <Flex as="ul" gap="xs">
              <li>
                <Link href={links.github.url} variant="unstyled" className={SOCIAL_LINK_CLASS}>
                  {copy.socials.github}
                  <span className="sr-only">{copy.newTab}</span>
                </Link>
              </li>
              {links.linkedin ? (
                <li>
                  <Link href={links.linkedin.url} variant="unstyled" className={SOCIAL_LINK_CLASS}>
                    {copy.socials.linkedin}
                    <span className="sr-only">{copy.newTab}</span>
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  href={mailtoHref(links.email)}
                  kind="internal"
                  variant="unstyled"
                  className={SOCIAL_LINK_CLASS}
                >
                  {copy.socials.email}
                </Link>
              </li>
            </Flex>
          </Flex>
        </Flex>
        <TerminalCard
          title={terminal.title}
          status={terminal.live}
          prompt={terminal.prompt}
          lines={lines}
          stats={[
            { label: terminal.stats.clockLabel, value: clock, tone: 'text' },
            { label: terminal.stats.buildLabel, value: terminal.stats.buildValue, tone: 'green' },
            { label: terminal.stats.focusLabel, value: localize(hero.focus), tone: 'indigo' },
          ]}
        />
      </Flex>
    </Box>
  );
}
