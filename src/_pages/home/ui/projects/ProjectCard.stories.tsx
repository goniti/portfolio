import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Project } from '../../model/projects';
import { projectsMessages } from './messages';
import { ProjectCard } from './ProjectCard';

const copy = projectsMessages.en;

const meeple: Project = {
  id: 'meeple',
  categories: ['react', 'full-stack'],
  technologies: ['React', 'NestJS', 'Keycloak'],
  image: { src: '/meeple-dashboard.png', width: 1594, height: 904 },
  tint: 'amber',
  sourceUrl: 'https://github.com/goniti',
};

const bipper: Project = {
  id: 'bipper',
  categories: ['mobile'],
  technologies: ['React Native', 'GraphQL', 'AWS'],
  tint: 'cyan',
  sourceUrl: 'https://github.com/goniti',
};

function cardCopy(project: Project) {
  const projectCopy = copy.projects[project.id];
  return {
    ...projectCopy,
    demo: copy.demo,
    demoLabel: copy.demoLabel(projectCopy.title),
    source: copy.source,
    sourceLabel: copy.sourceLabel(projectCopy.title),
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
