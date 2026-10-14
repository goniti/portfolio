import type { Meta, StoryObj } from '@storybook/react-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { SiteFooter } from './SiteFooter';

const meta = {
  title: 'Pages/Home/SiteFooter',
  component: SiteFooter,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    openToWork: HOME_CONTENT_FIXTURE.site.openToWork,
    status: HOME_CONTENT_FIXTURE.site.status,
    credits: HOME_CONTENT_FIXTURE.site.credits,
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Busy: Story = { args: { openToWork: false } };
