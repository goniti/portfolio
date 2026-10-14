import type { Meta, StoryObj } from '@storybook/react-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { SiteNav } from './SiteNav';

const meta = {
  title: 'Pages/Home/SiteNav',
  component: SiteNav,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    ownerName: HOME_CONTENT_FIXTURE.site.ownerName,
    avatarUrl: HOME_CONTENT_FIXTURE.site.avatarUrl,
  },
} satisfies Meta<typeof SiteNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const Mobile: Story = { globals: { viewport: { value: 'mobile1' } } };
