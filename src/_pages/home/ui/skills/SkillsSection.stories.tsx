import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillsSection } from './SkillsSection';

const meta = {
  title: 'Pages/Home/SkillsSection',
  component: SkillsSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SkillsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
