import type { Meta, StoryObj } from '@storybook/react-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ContactSection } from './ContactSection';

const meta = {
  title: 'Pages/Home/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: { contact: HOME_CONTENT_FIXTURE.contact, links: HOME_CONTENT_FIXTURE.site.links },
} satisfies Meta<typeof ContactSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
