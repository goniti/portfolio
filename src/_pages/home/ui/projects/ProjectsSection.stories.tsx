import type { Meta, StoryObj } from '@storybook/react-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ProjectsSection } from './ProjectsSection';

const meta = {
  title: 'Pages/Home/ProjectsSection',
  component: ProjectsSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    title: HOME_CONTENT_FIXTURE.sectionTitles.projects,
    projects: HOME_CONTENT_FIXTURE.projects,
  },
} satisfies Meta<typeof ProjectsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
