import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExperienceSection } from './ExperienceSection';

const meta = {
  title: 'Pages/Home/ExperienceSection',
  component: ExperienceSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExperienceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
