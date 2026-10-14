import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CopyButton } from './CopyButton';

const meta = {
  title: 'Shared/Molecules/CopyButton',
  component: CopyButton,
  args: {
    value: 'hello@example.com',
    label: 'Copy email',
    copiedLabel: 'Copied!',
    failedLabel: 'Copy failed',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Click to copy the value: the tooltip confirms it for two seconds and a live region announces it.',
      },
    },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const French: Story = {
  args: { label: 'Copier l’email', copiedLabel: 'Copié !', failedLabel: 'Échec de la copie' },
};
