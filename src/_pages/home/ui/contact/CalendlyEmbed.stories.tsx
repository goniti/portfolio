import type { Meta, StoryObj } from '@storybook/react-vite';
import { calendlyEmbedUrl } from '../../model/contact';
import { CalendlyEmbed } from './CalendlyEmbed';
import { contactMessages } from './messages';

const meta = {
  title: 'Pages/Home/CalendlyEmbed',
  component: CalendlyEmbed,
  args: {
    src: calendlyEmbedUrl('https://calendly.com/portfolio/intro-call', 'dark') ?? '',
    title: contactMessages.en.calendlyTitle,
    loadingLabel: contactMessages.en.calendlyLoading,
    loadAfterViewports: 0.9,
  },
  decorators: [
    (Story) => (
      <div className="w-140">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalendlyEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Loads once scrolled past the threshold or near the viewport, behind a skeleton of the same size. */
export const Default: Story = {};
