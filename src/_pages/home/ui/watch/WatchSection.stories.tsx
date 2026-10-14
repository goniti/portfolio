import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { WatchSection } from './WatchSection';

const meta = {
  title: 'Pages/Home/WatchSection',
  component: WatchSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    title: HOME_CONTENT_FIXTURE.sectionTitles.watch,
    notes: HOME_CONTENT_FIXTURE.notes,
  },
} satisfies Meta<typeof WatchSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
