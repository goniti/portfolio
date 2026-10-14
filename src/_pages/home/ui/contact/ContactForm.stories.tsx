import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ContactForm } from './ContactForm';

const meta = {
  title: 'Pages/Home/ContactForm',
  component: ContactForm,
  args: { recipient: 'gonzalezlovullocarlos@gmail.com', openMailto: fn() },
  decorators: [
    (Story) => (
      <div className="w-110">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
