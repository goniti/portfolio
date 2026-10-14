import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScrollProgress } from './ScrollProgress';

const meta = {
  title: 'Pages/Home/ScrollProgress',
  component: ScrollProgress,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => {
      document.documentElement.style.setProperty('--scroll-progress', '0.4');
      return Story();
    },
  ],
} satisfies Meta<typeof ScrollProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FortyPercent: Story = {};
