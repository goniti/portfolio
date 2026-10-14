import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Project } from '../../model/content';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { projectsMessages } from './messages';
import { ProjectCard } from './ProjectCard';

function fixtureProject(id: string): Project {
  const project = HOME_CONTENT_FIXTURE.projects.find((candidate) => candidate.id === id);
  if (!project) throw new Error(`No fixture project "${id}"`);
  return project;
}

const meeple = fixtureProject('project-meeple');
const bipper = fixtureProject('project-bipper');

const meta = {
  title: 'Pages/Home/ProjectCard',
  component: ProjectCard,
  args: { project: meeple, copy: projectsMessages.en },
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
export const Placeholder: Story = { args: { project: bipper } };
export const WithDemo: Story = {
  args: { project: { ...meeple, demoUrl: 'https://example.com' } },
};
