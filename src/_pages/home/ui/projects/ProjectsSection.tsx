'use client';

import { Flex, Grid } from 'goniui';
import { useLocalized, useMessages, type Localized } from '@/shared/lib/i18n';
import { REVEAL, revealStagger } from '@/shared/lib/motion';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import type { Project } from '../../model/content';
import { filterProjects, PROJECT_FILTERS } from '../../model/projects';
import { useListFilter } from '../../model/useListFilter';
import { FilterBar } from '../filter-bar/FilterBar';
import { projectsMessages } from './messages';
import { ProjectCard } from './ProjectCard';

export interface ProjectsSectionProps {
  title: Localized<string>;
  projects: readonly Project[];
}

/** Selected work, filterable by stack or kind of project. */
export function ProjectsSection({ title, projects }: ProjectsSectionProps) {
  const localize = useLocalized();
  const copy = useMessages(projectsMessages);
  const { filter, setFilter, visibleItems } = useListFilter(projects, filterProjects, 'all');

  return (
    <PageSection id="projects" labelledBy="projects-title">
      <Flex justify="between" align="end" wrap="wrap" className="gap-6" {...REVEAL.columns}>
        <SectionHeading eyebrow={copy.eyebrow} title={localize(title)} titleId="projects-title" />
        <FilterBar
          label={copy.filtersLabel}
          options={PROJECT_FILTERS}
          labels={copy.filters}
          value={filter}
          onChange={setFilter}
          look="segment"
        />
      </Flex>
      <Grid
        as="ul"
        cols={{ base: 1, md: 2, lg: 3 }}
        gap="lg"
        {...revealStagger({ from: 'rows', zoom: true })}
      >
        {visibleItems.map((project) => (
          <li key={project.id} className="flex">
            <ProjectCard project={project} copy={copy} />
          </li>
        ))}
      </Grid>
    </PageSection>
  );
}
