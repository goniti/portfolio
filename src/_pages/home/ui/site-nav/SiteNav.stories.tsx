import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteNav } from './SiteNav';

const meta = {
  title: 'Pages/Home/SiteNav',
  component: SiteNav,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SiteNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const Mobile: Story = { globals: { viewport: { value: 'mobile1' } } };
