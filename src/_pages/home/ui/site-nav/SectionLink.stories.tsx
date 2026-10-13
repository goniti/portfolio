import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionLink } from './SectionLink';

const meta = {
  title: 'Pages/Home/SectionLink',
  component: SectionLink,
  args: { href: '#projects', children: 'Projects', layout: 'bar', active: false },
} satisfies Meta<typeof SectionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bar: Story = {};
export const Active: Story = { args: { active: true } };
export const MenuItem: Story = { args: { layout: 'menu' } };
