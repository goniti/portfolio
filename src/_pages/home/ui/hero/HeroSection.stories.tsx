import type { Meta, StoryObj } from '@storybook/react-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { HeroSection } from './HeroSection';

const meta = {
  title: 'Pages/Home/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: { hero: HOME_CONTENT_FIXTURE.hero, links: HOME_CONTENT_FIXTURE.site.links },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
