import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeading } from './SectionHeading';

const meta = {
  title: 'Shared/Molecules/SectionHeading',
  component: SectionHeading,
  args: {
    eyebrow: '01 — Experience',
    title: 'Five years shipping product inside two startups.',
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithBadge: Story = {
  args: { badge: <span className="text-xs text-success">Continuous watch</span> },
};
