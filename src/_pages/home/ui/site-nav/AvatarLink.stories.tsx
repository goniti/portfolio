import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarLink } from './AvatarLink';

const meta = {
  title: 'Pages/Home/AvatarLink',
  component: AvatarLink,
  args: { href: '#home', label: 'Back to top', size: 'md' },
} satisfies Meta<typeof AvatarLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {};
export const Large: Story = { args: { size: 'lg' } };
