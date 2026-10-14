import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageBackdrop } from './PageBackdrop';

const meta = {
  title: 'Pages/Home/PageBackdrop',
  component: PageBackdrop,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="relative h-screen overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
