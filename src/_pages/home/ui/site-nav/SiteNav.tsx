'use client';

import { useState } from 'react';
import * as Collapsible from 'goniui/collapsible';
import { Box, Flex, Text } from 'goniui';
import { withBasePath } from '@/shared/lib/base-path';
import { useMessages } from '@/shared/lib/i18n';
import { CtaButton } from '@/shared/ui/atoms';
import { RESUME_PATH } from '../../config/site';
import { formatIndex } from '../../model/format';
import { SECTION_IDS, type SectionId } from '../../model/sections';
import { useScrollSpy } from '../../model/useScrollSpy';
import { AvatarLink } from './AvatarLink';
import { LocaleSegments, LocaleToggle } from './LocaleSwitch';
import { SectionLink } from './SectionLink';
import { ThemeToggle } from './ThemeToggle';
import { siteNavMessages } from './messages';

const GLASS_BAR =
  'border border-border bg-surface-glass shadow-nav backdrop-blur-xl backdrop-saturate-150';

function ResumeLink() {
  const copy = useMessages(siteNavMessages);
  if (!RESUME_PATH) return null;

  return (
    <CtaButton asChild tone="inverse" size="pill">
      <a href={withBasePath(RESUME_PATH)} download>
        {copy.resume}
        <span aria-hidden="true" className="font-mono">
          {copy.downloadGlyph}
        </span>
      </a>
    </CtaButton>
  );
}

interface NavBarProps {
  activeSection: SectionId;
  avatarUrl: string;
}

/** Floating pill navigation for large screens. */
function WideNavBar({ activeSection, avatarUrl }: NavBarProps) {
  const copy = useMessages(siteNavMessages);

  return (
    <Flex
      as="header"
      justify="center"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 hidden px-4 lg:flex"
    >
      <Flex
        as="nav"
        align="center"
        aria-label={copy.navLabel}
        className={`${GLASS_BAR} pointer-events-auto gap-1.5 rounded-full p-1.5`}
      >
        <AvatarLink href="#home" src={avatarUrl} label={copy.homeLink} />
        <Flex as="ul" gap="none" className="gap-0.5 px-1">
          {SECTION_IDS.map((sectionId) => (
            <li key={sectionId}>
              <SectionLink href={`#${sectionId}`} active={sectionId === activeSection}>
                {copy.sections[sectionId]}
              </SectionLink>
            </li>
          ))}
        </Flex>
        <LocaleSegments />
        <ThemeToggle />
        <ResumeLink />
      </Flex>
    </Flex>
  );
}

interface CompactNavBarProps extends NavBarProps {
  ownerName: string;
}

/** Compact bar with a collapsible section menu for small screens. */
function CompactNavBar({ activeSection, avatarUrl, ownerName }: CompactNavBarProps) {
  const copy = useMessages(siteNavMessages);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Box as="header" className="fixed inset-x-2.5 top-2.5 z-50 lg:hidden">
      <Collapsible.Root open={isMenuOpen} onOpenChange={setMenuOpen}>
        <Flex
          as="nav"
          align="center"
          gap="sm"
          aria-label={copy.navLabel}
          className={`${GLASS_BAR} rounded-2xl p-1.5`}
        >
          <AvatarLink
            href="#home"
            src={avatarUrl}
            label={copy.homeLink}
            size="lg"
            onClick={closeMenu}
          />
          <Flex direction="col" className="min-w-0 flex-1 leading-tight">
            <Text as="span" variant="label" className="truncate font-bold">
              {ownerName}
            </Text>
            <Text as="span" variant="caption" className="font-mono text-2xs text-foreground-subtle">
              {copy.sections[activeSection]}
            </Text>
          </Flex>
          <LocaleToggle />
          <ThemeToggle size="lg" />
          <Collapsible.Trigger
            aria-label={isMenuOpen ? copy.closeMenu : copy.openMenu}
            className="size-11 flex-none rounded-xl bg-surface-inverse font-mono font-semibold text-base text-foreground-inverse"
          >
            <span aria-hidden="true">
              {isMenuOpen ? copy.menuGlyph.open : copy.menuGlyph.closed}
            </span>
          </Collapsible.Trigger>
        </Flex>
        <Collapsible.Content className={`${GLASS_BAR} mt-2 flex flex-col gap-0.5 rounded-2xl p-2`}>
          {SECTION_IDS.map((sectionId, index) => (
            <SectionLink
              key={sectionId}
              href={`#${sectionId}`}
              layout="menu"
              active={sectionId === activeSection}
              onClick={closeMenu}
            >
              {copy.sections[sectionId]}
              <Text as="span" variant="caption" className="font-mono text-foreground-subtle">
                {formatIndex(index)}
              </Text>
            </SectionLink>
          ))}
          {RESUME_PATH ? (
            <CtaButton asChild size="md" className="mt-1.5 min-h-12">
              <a href={withBasePath(RESUME_PATH)} download>
                {copy.resume} {copy.downloadGlyph}
              </a>
            </CtaButton>
          ) : null}
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}

export interface SiteNavProps {
  ownerName: string;
  /** Portrait in the avatar link (decorative). */
  avatarUrl: string;
}

/**
 * Site navigation: a floating pill on large screens, a compact bar with a menu below `lg`.
 * Highlights the section being read.
 */
export function SiteNav({ ownerName, avatarUrl }: SiteNavProps) {
  const activeSection = useScrollSpy();

  return (
    <>
      <WideNavBar activeSection={activeSection} avatarUrl={avatarUrl} />
      <CompactNavBar activeSection={activeSection} avatarUrl={avatarUrl} ownerName={ownerName} />
    </>
  );
}
