import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Surface } from './Surface';

const meta = {
  title: 'Shared/Atoms/Surface',
  component: Surface,
  args: { className: 'w-80 p-6', children: 'Glass panel', fill: 'glass', hover: 'lift' },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Glass: Story = {};
export const IndigoCorner: Story = { args: { fill: 'indigo', hover: 'indigo' } };
export const VioletCorner: Story = { args: { fill: 'violet', hover: 'violet' } };
export const Contact: Story = { args: { fill: 'contact', radius: 'xl' } };
