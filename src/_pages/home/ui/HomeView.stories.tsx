import type { Meta, StoryObj } from '@storybook/react-vite';
import { HOME_CONTENT_FIXTURE } from '../model/content.fixture';
import { HomeView } from './HomeView';

const meta = {
  title: 'Pages/Home/HomeView',
  component: HomeView,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: { content: HOME_CONTENT_FIXTURE, calendlyUrl: 'https://calendly.com/portfolio/intro-call' },
} satisfies Meta<typeof HomeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
