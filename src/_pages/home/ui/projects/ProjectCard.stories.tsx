import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Project } from '../../model/content';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { projectsMessages } from './messages';
import { ProjectCard } from './ProjectCard';

const copy = projectsMessages.en;

function fixtureProject(id: string): Project {
  const project = HOME_CONTENT_FIXTURE.projects.find((candidate) => candidate.id === id);
  if (!project) throw new Error(`No fixture project "${id}"`);
  return project;
}

const meeple = fixtureProject('project-meeple');
const bipper = fixtureProject('project-bipper');

function cardCopy(project: Project) {
  const title = project.title.en;
  return {
    title,
    kind: project.kind.en,
    description: project.description.en,
    imageAlt: project.image?.alt.en ?? '',
    placeholder: project.placeholder?.en ?? '',
    demo: copy.demo,
    demoLabel: copy.demoLabel(title),
    source: copy.source,
    sourceLabel: copy.sourceLabel(title),
  };
}

const meta = {
  title: 'Pages/Home/ProjectCard',
  component: ProjectCard,
  args: { project: meeple, copy: cardCopy(meeple) },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithScreenshot: Story = {};
export const Placeholder: Story = { args: { project: bipper, copy: cardCopy(bipper) } };
export const WithDemo: Story = {
  args: { project: { ...meeple, demoUrl: 'https://example.com' }, copy: cardCopy(meeple) },
};
