import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Shared/Atoms/Tag',
  component: Tag,
  args: { children: 'TypeScript' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {};
export const Outlined: Story = { args: { filled: false } };
export const Medium: Story = { args: { size: 'md' } };
