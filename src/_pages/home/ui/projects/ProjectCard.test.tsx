import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { projectsMessages } from './messages';
import { ProjectCard } from './ProjectCard';

const project = HOME_CONTENT_FIXTURE.projects[0];

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
});
