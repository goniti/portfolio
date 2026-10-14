import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { HeroSection } from './HeroSection';

const meta = {
  title: 'Pages/Home/HeroSection',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    hero: HOME_CONTENT_FIXTURE.hero,
    person: HOME_CONTENT_FIXTURE.site.person,
    links: HOME_CONTENT_FIXTURE.site.links,
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Before the owner fills the person in the Studio: the badge and the tagline heading. */
export const WithoutPerson: Story = { args: { person: null } };
