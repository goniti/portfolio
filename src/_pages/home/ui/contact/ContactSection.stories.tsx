import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContactSection } from './ContactSection';

const meta = {
  title: 'Pages/Home/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContactSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
