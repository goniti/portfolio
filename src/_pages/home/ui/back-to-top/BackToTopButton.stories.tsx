import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackToTopButton } from './BackToTopButton';

const meta = {
  title: 'Pages/Home/BackToTopButton',
  component: BackToTopButton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Scroll the canvas past one viewport: the button rises in, bottom right, and scrolls back to the top.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col">
        <div className="h-screen" />
        <div className="h-screen" />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackToTopButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
