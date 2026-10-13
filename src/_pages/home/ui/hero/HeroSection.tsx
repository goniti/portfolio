'use client';

import { Box, Flex, Link, Text } from 'goniui';
import { useMessages } from '@/shared/lib/i18n';
import { CtaButton, PulseDot } from '@/shared/ui/atoms';
import { CLOCK_TIME_ZONE, SITE_LINKS, TYPE_SPEED_MS } from '../../config/site';
import { buildTerminalScript } from '../../model/terminal';
import { useClock } from '../../model/useClock';
import { useTypewriter } from '../../model/useTypewriter';
import { heroMessages } from './messages';
import { TerminalCard } from './TerminalCard';

const SOCIAL_LINK_CLASS =
  'flex h-11 items-center rounded-lg px-3 font-mono text-xs font-medium text-foreground-muted hover:text-foreground-strong';

/** Opening section: pitch, calls to action and the live terminal card. */
export function HeroSection() {
  const copy = useMessages(heroMessages);
  const { terminal } = copy;
  const lines = useTypewriter(buildTerminalScript(terminal.script), TYPE_SPEED_MS);
  const clock = useClock(CLOCK_TIME_ZONE);

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
            className="inline-flex items-center gap-2.5 self-start rounded-full border border-tint-indigo/30 bg-tint-indigo-strong/10 py-1.5 pr-3.5 pl-2.5 font-mono font-medium text-accent-indigo"
          >
            <PulseDot />
            {copy.badge}
          </Text>
          <Text
            as="h1"
            variant="display"
            id="home-title"
            className="text-4xl leading-display font-extrabold tracking-tighter text-balance md:text-5xl lg:text-6xl"
          >
            {copy.titleStart}
            <span className="text-sheen motion-safe:animate-sheen">{copy.titleHighlight}</span>
            {copy.titleEnd}
          </Text>
          <Text
            variant="bodyLg"
            tone="muted"
            className="max-w-145 text-lg leading-relaxed text-pretty"
          >
            {copy.lead}
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
                <Link href={SITE_LINKS.github} variant="unstyled" className={SOCIAL_LINK_CLASS}>
                  {copy.socials.github}
                  <span className="sr-only">{copy.newTab}</span>
                </Link>
              </li>
              {SITE_LINKS.linkedin ? (
                <li>
                  <Link href={SITE_LINKS.linkedin} variant="unstyled" className={SOCIAL_LINK_CLASS}>
                    {copy.socials.linkedin}
                    <span className="sr-only">{copy.newTab}</span>
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  href={SITE_LINKS.email}
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
            { label: terminal.stats.focusLabel, value: terminal.stats.focusValue, tone: 'indigo' },
          ]}
        />
      </Flex>
    </Box>
  );
}
