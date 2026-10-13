import type { Meta, StoryObj } from '@storybook/react-vite';
import { PulseDot } from './PulseDot';

const meta = {
  title: 'Shared/Atoms/PulseDot',
  component: PulseDot,
  args: { size: 'md' },
} satisfies Meta<typeof PulseDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {};
export const Small: Story = { args: { size: 'sm' } };
