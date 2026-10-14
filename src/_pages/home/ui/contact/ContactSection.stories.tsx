import type { Meta, StoryObj } from '@storybook/react-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ContactSection } from './ContactSection';

const meta = {
  title: 'Pages/Home/ContactSection',
  component: ContactSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    contact: HOME_CONTENT_FIXTURE.contact,
    links: HOME_CONTENT_FIXTURE.site.links,
    calendlyUrl: 'https://calendly.com/portfolio/intro-call',
  },
} satisfies Meta<typeof ContactSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A Calendly page is configured: "Book a call" comes first, the message form second. */
export const Default: Story = {};

/** No Calendly page: the message form only, without tabs. */
export const WithoutCalendly: Story = { args: { calendlyUrl: undefined } };
