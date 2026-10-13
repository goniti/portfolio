import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroSection } from './HeroSection';

const meta = {
  title: 'Pages/Home/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
