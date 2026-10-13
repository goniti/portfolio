import type { Meta, StoryObj } from '@storybook/react-vite';
import { WatchSection } from './WatchSection';

const meta = {
  title: 'Pages/Home/WatchSection',
  component: WatchSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof WatchSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
