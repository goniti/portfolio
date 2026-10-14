'use client';

import * as SegmentedControl from 'goniui/segmented-control';
import { Flex, Grid } from 'goniui';
import { tv } from 'tailwind-variants';
import { useLocale, useMessages, type Localized } from '@/shared/lib/i18n';
import { REVEAL, revealStagger } from '@/shared/lib/motion';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import type { Project } from '../../model/content';
import { filterProjects, PROJECT_FILTERS } from '../../model/projects';
import { useListFilter } from '../../model/useListFilter';
import { projectsMessages } from './messages';
import { ProjectCard } from './ProjectCard';

const filterOptionVariants = tv({
  base: 'min-h-9 flex-none rounded-lg px-3.5 py-0 text-sm font-medium transition duration-200',
  variants: {
    active: {
      true: 'bg-tint-indigo/20 text-foreground-strong shadow-segment-active',
      false: 'bg-transparent text-foreground-muted hover:text-foreground-strong',
    },
  },
});

export interface ProjectsSectionProps {
  title: Localized<string>;
  projects: readonly Project[];
}

/** Selected work, filterable by stack or kind of project. */
export function ProjectsSection({ title, projects }: ProjectsSectionProps) {
  const { locale } = useLocale();
  const copy = useMessages(projectsMessages);
  const { filter, setFilter, visibleItems } = useListFilter(projects, filterProjects, 'all');

  return (
    <PageSection id="projects" labelledBy="projects-title">
      <Flex justify="between" align="end" wrap="wrap" className="gap-6" {...REVEAL.columns}>
        <SectionHeading eyebrow={copy.eyebrow} title={title[locale]} titleId="projects-title" />
        <SegmentedControl.Root
          aria-label={copy.filtersLabel}
          className="w-auto max-w-full rounded-xl border-border bg-chip p-1"
        >
          {PROJECT_FILTERS.map((option) => (
            <SegmentedControl.Item
              key={option}
              active={option === filter}
              aria-pressed={option === filter}
              onClick={() => setFilter(option)}
              className={filterOptionVariants({ active: option === filter })}
            >
              {copy.filters[option]}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </Flex>
      <Grid
        as="ul"
        cols={{ base: 1, md: 2, lg: 3 }}
        gap="lg"
        {...revealStagger({ from: 'rows', zoom: true })}
      >
        {visibleItems.map((project) => {
          const projectTitle = project.title[locale];
          return (
            <li key={project.id} className="flex">
              <ProjectCard
                project={project}
                copy={{
                  title: projectTitle,
                  kind: project.kind[locale],
                  description: project.description[locale],
                  imageAlt: project.image?.alt[locale] ?? '',
                  placeholder: project.placeholder?.[locale] ?? '',
                  demo: copy.demo,
                  demoLabel: copy.demoLabel(projectTitle),
                  source: copy.source,
                  sourceLabel: copy.sourceLabel(projectTitle),
                }}
              />
            </li>
          );
        })}
      </Grid>
    </PageSection>
  );
}
