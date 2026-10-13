import type { Meta, StoryObj } from '@storybook/react-vite';
import { CtaButton } from './CtaButton';

const meta = {
  title: 'Shared/Atoms/CtaButton',
  component: CtaButton,
  args: { children: 'Explore my work', tone: 'gradient', size: 'lg' },
} satisfies Meta<typeof CtaButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gradient: Story = {};
export const Outline: Story = { args: { tone: 'outline', children: 'Get in touch' } };
export const Soft: Story = { args: { tone: 'soft', size: 'md', children: 'Live demo' } };
export const Quiet: Story = { args: { tone: 'quiet', size: 'md', children: 'Source code' } };
export const Inverse: Story = { args: { tone: 'inverse', size: 'pill', children: 'Resume PDF' } };
export const AsLink: Story = {
  args: { asChild: true, children: <a href="#projects">Explore my work</a> },
};
