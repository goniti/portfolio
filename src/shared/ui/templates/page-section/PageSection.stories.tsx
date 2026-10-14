import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageSection } from './PageSection';

const meta = {
  title: 'Shared/Templates/PageSection',
  component: PageSection,
  parameters: { layout: 'fullscreen' },
  args: {
    id: 'skills',
    labelledBy: 'skills-title',
    children: (
      <>
        <h2 id="skills-title">Skills</h2>
        <p>Section content stacks with the section rhythm.</p>
      </>
    ),
  },
} satisfies Meta<typeof PageSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Closing: Story = { args: { spacing: 'closing' } };
