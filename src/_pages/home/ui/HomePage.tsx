import type { Metadata } from 'next';
import { Box } from 'goniui';
import { CursorFollower, ScrollReveal } from '@/shared/ui/atoms';
import { BackToTopButton } from './back-to-top/BackToTopButton';
import { ContactSection } from './contact/ContactSection';
import { ExperienceSection } from './experience/ExperienceSection';
import { HeroSection } from './hero/HeroSection';
import { homeMessages } from './messages';
import { PageBackdrop } from './page-backdrop/PageBackdrop';
import { ProjectsSection } from './projects/ProjectsSection';
import { ScrollProgress } from './scroll-progress/ScrollProgress';
import { SiteFooter } from './site-footer/SiteFooter';
import { SiteNav } from './site-nav/SiteNav';
import { SkillsSection } from './skills/SkillsSection';
import { WatchSection } from './watch/WatchSection';

export const homeMetadata: Metadata = {
  title: homeMessages.metadataTitle,
  description: homeMessages.metadataDescription,
};

/** The portfolio: hero, experience, skills, projects, tech watch and contact on one page. */
export function HomePage() {
  return (
    <>
      <ScrollProgress />
      <SiteNav />
      <Box as="main" className="relative overflow-hidden">
        <PageBackdrop />
        <HeroSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <WatchSection />
        <ContactSection />
      </Box>
      <SiteFooter />
      <BackToTopButton />
      <ScrollReveal />
      <CursorFollower />
    </>
  );
}
