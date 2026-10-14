import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { SkillsSection } from './SkillsSection';

const meta = {
  title: 'Pages/Home/SkillsSection',
  component: SkillsSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    title: HOME_CONTENT_FIXTURE.sectionTitles.skills,
    skills: HOME_CONTENT_FIXTURE.skills,
  },
} satisfies Meta<typeof SkillsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
