import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSegments, LanguageToggle } from './LanguageSwitch';

const meta = {
  title: 'Pages/Home/LanguageSwitch',
  component: LanguageSegments,
} satisfies Meta<typeof LanguageSegments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Segments: Story = {};
export const Toggle: Story = { render: () => <LanguageToggle /> };
