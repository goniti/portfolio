import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ExperienceSection } from './ExperienceSection';

const meta = {
  title: 'Pages/Home/ExperienceSection',
  component: ExperienceSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    title: HOME_CONTENT_FIXTURE.sectionTitles.experience,
    jobs: HOME_CONTENT_FIXTURE.jobs,
  },
} satisfies Meta<typeof ExperienceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
