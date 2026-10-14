import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CtaButton } from './CtaButton';

const meta = {
  title: 'Shared/Atoms/CtaButton',
  component: CtaButton,
  args: { children: 'Explore my work', tone: 'gradient', size: 'lg' },
  parameters: {
    docs: {
      description: {
        component:
          'The gradient tone is the primary call to action: it leans towards the mouse and is wrapped by the cursor follower (`magnetic`, on by default for that tone only).',
      },
    },
  },
} satisfies Meta<typeof CtaButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gradient: Story = {};
export const FullWidthSubmit: Story = {
  args: { type: 'submit', block: true, children: 'Send message →' },
  decorators: [
    (Story) => (
      <div className="w-110">
        <Story />
      </div>
    ),
  ],
};
export const MagneticOutline: Story = {
  args: { tone: 'outline', magnetic: true, children: 'Get in touch' },
};
export const Outline: Story = { args: { tone: 'outline', children: 'Get in touch' } };
export const Soft: Story = { args: { tone: 'soft', size: 'md', children: 'Live demo' } };
export const Quiet: Story = { args: { tone: 'quiet', size: 'md', children: 'Source code' } };
export const Inverse: Story = { args: { tone: 'inverse', size: 'pill', children: 'Resume PDF' } };
export const AsLink: Story = {
  args: { asChild: true, children: <a href="#projects">Explore my work</a> },
};
