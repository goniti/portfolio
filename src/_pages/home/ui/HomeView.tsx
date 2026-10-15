'use client';

import { Box } from 'goniui';
import { useScrollReveal } from '@/shared/lib/motion';
import { CursorFollower } from '@/shared/ui/atoms';
import type { HomeContent } from '../model/content';
import { BackToTopButton } from './back-to-top/BackToTopButton';
import { ContactSection } from './contact/ContactSection';
import { ExperienceSection } from './experience/ExperienceSection';
import { HeroSection } from './hero/HeroSection';
import { PageBackdrop } from './page-backdrop/PageBackdrop';
import { ProjectsSection } from './projects/ProjectsSection';
import { ScrollProgress } from './scroll-progress/ScrollProgress';
import { SiteFooter } from './site-footer/SiteFooter';
import { SiteNav } from './site-nav/SiteNav';
import { SkillsSection } from './skills/SkillsSection';
import { WatchSection } from './watch/WatchSection';

export interface HomeViewProps {
  /** Both locales of every text: the locale toggle switches on the client. */
  content: HomeContent;
  /** Calendly scheduling page; absent hides the "Book a call" tab. */
  calendlyUrl?: string;
}

/** The whole page; plays the entrance of every section marked with `REVEAL` as it scrolls in. */
export function HomeView({ content, calendlyUrl }: HomeViewProps) {
  const { site, sectionTitles } = content;
  useScrollReveal();

  return (
    <>
      <ScrollProgress />
      <SiteNav ownerName={site.ownerName} avatarUrl={site.avatarUrl} />
      <Box as="main" className="relative overflow-hidden">
        <PageBackdrop />
        <HeroSection hero={content.hero} person={site.person} links={site.links} />
        <ExperienceSection title={sectionTitles.experience} jobs={content.jobs} />
        <SkillsSection title={sectionTitles.skills} skills={content.skills} />
        <ProjectsSection title={sectionTitles.projects} projects={content.projects} />
        <WatchSection title={sectionTitles.watch} notes={content.notes} />
        <ContactSection contact={content.contact} links={site.links} calendlyUrl={calendlyUrl} />
      </Box>
      <SiteFooter openToWork={site.openToWork} status={site.status} credits={site.credits} />
      <BackToTopButton />
      <CursorFollower />
    </>
  );
}
