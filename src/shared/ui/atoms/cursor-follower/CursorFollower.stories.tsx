import type { Meta, StoryObj } from '@storybook/react-vite';
import { CursorFollower } from './CursorFollower';

const meta = {
  title: 'Shared/Atoms/CursorFollower',
  component: CursorFollower,
  parameters: {
    docs: {
      description: {
        component:
          'Move the mouse over the canvas: the dot springs after the pointer and wraps small buttons. Hidden on touch screens and with reduced motion.',
      },
    },
  },
} satisfies Meta<typeof CursorFollower>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
