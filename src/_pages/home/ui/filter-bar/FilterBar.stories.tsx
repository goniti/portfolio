import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { PROJECT_FILTERS } from '../../model/projects';
import { projectsMessages } from '../projects/messages';
import { FilterBar } from './FilterBar';

const copy = projectsMessages.en;

const meta = {
  title: 'Pages/Home/FilterBar',
  component: FilterBar,
  args: {
    label: copy.filtersLabel,
    options: PROJECT_FILTERS,
    labels: copy.filters,
    value: 'all',
    onChange: fn(),
    look: 'segment',
  },
} satisfies Meta<typeof FilterBar<(typeof PROJECT_FILTERS)[number]>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Segment: Story = {};

export const Pill: Story = { args: { look: 'pill', value: 'mobile' } };
