import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LocaleSegments, LocaleToggle } from './LocaleSwitch';

const meta = {
  title: 'Pages/Home/LocaleSwitch',
  component: LocaleSegments,
} satisfies Meta<typeof LocaleSegments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Segments: Story = {};
export const Toggle: Story = { render: () => <LocaleToggle /> };
