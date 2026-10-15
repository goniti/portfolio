import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Project } from '../../model/content';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { projectsMessages } from './messages';
import { ProjectCard } from './ProjectCard';

const project = HOME_CONTENT_FIXTURE.projects[0];
const copy = projectsMessages.en;
const DEMO_URL = 'https://example.com';
const SOURCE_URL = 'https://github.com/goniti';

function renderCard(links: Pick<Project, 'demoUrl' | 'sourceUrl'>) {
  if (!project) throw new Error('No fixture project');
  render(<ProjectCard project={{ ...project, ...links }} copy={copy} />);
  return project.title.en;
}

function linkHrefs() {
  return screen.queryAllByRole('link').map((link) => link.getAttribute('href'));
}

describe('ProjectCard', () => {
  afterEach(() => window.localStorage.clear());

  it('shows the content of the current locale and labels the source link with it', () => {
    if (!project) throw new Error('No fixture project');
    window.localStorage.setItem('pf-lang', 'fr');
    render(<ProjectCard project={project} copy={projectsMessages.fr} />);
    expect(screen.getByRole('heading', { name: project.title.fr })).toBeTruthy();
    expect(
      screen.getByRole('link', { name: projectsMessages.fr.sourceLabel(project.title.fr) }),
    ).toBeTruthy();
  });

  it('shows only the source link when the project has no demo', () => {
    const title = renderCard({ demoUrl: null, sourceUrl: SOURCE_URL });
    expect(screen.getByRole('link', { name: copy.sourceLabel(title) })).toBeTruthy();
    expect(linkHrefs()).toEqual([SOURCE_URL]);
  });

  it('shows only the demo link when the project has no source', () => {
    const title = renderCard({ demoUrl: DEMO_URL, sourceUrl: null });
    expect(screen.getByRole('link', { name: copy.demoLabel(title) })).toBeTruthy();
    expect(linkHrefs()).toEqual([DEMO_URL]);
  });

  it('shows the demo link, then the source link, when both are set', () => {
    renderCard({ demoUrl: DEMO_URL, sourceUrl: SOURCE_URL });
    expect(linkHrefs()).toEqual([DEMO_URL, SOURCE_URL]);
  });

  it('leaves no empty actions row when the project has neither link', () => {
    renderCard({ demoUrl: null, sourceUrl: null });
    expect(linkHrefs()).toEqual([]);
    expect(screen.getByRole('list').nextElementSibling).toBeNull();
  });
});
