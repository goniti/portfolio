import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SECTOR_TINTS } from 'portfolio-content-model';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ExperienceSection } from './ExperienceSection';

const jobs = HOME_CONTENT_FIXTURE.jobs;
const [currentJob] = jobs;

const meta = {
  title: 'Pages/Home/ExperienceSection',
  component: ExperienceSection,
  parameters: { layout: 'fullscreen' },
  // Fixture content: stories never fetch from Sanity.
  args: {
    title: HOME_CONTENT_FIXTURE.sectionTitles.experience,
    jobs,
  },
} satisfies Meta<typeof ExperienceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each job in its sector: the two PulseLife jobs share the MedTech sector, so they match. */
export const Default: Story = {};

/** The production content before the owner links the jobs to sectors (#24). */
export const WithoutSector: Story = {
  args: { jobs: jobs.map((job) => ({ ...job, sector: null })) },
};

export const WithoutSummary: Story = {
  args: { jobs: jobs.map((job) => ({ ...job, summary: null })) },
};

/** One card per sector tint, to check the label contrast of each in both themes. */
export const AllTints: Story = {
  args: {
    jobs: currentJob
      ? SECTOR_TINTS.map((tint) => ({
          ...currentJob,
          id: `job-${tint}`,
          sector: { id: `sector-${tint}`, name: { en: tint, fr: tint }, tint },
        }))
      : [],
  },
};
