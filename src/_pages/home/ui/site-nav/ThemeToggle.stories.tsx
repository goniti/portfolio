import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ThemeToggle } from './ThemeToggle';

const meta = {
  title: 'Pages/Home/ThemeToggle',
  component: ThemeToggle,
  args: { size: 'md' },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Round: Story = {};
export const Square: Story = { args: { size: 'lg' } };
