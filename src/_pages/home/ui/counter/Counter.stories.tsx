import type { Meta, StoryObj } from '@storybook/react-vite';
import { Counter } from './Counter';

const meta = {
  title: 'Pages/Home/Counter',
  component: Counter,
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
