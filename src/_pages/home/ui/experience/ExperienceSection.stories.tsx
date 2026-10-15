import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { Box, Text } from 'goniui';
import { SECTOR_TINTS } from 'portfolio-content-model';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { HOME_CONTENT_FIXTURE } from '../../model/content.fixture';
import { ExperienceSection } from './ExperienceSection';

const jobs = HOME_CONTENT_FIXTURE.jobs;
const [currentJob] = jobs;

/** The timeline pins while the page scrolls through it: room above and below to scroll. */
const withScrollRoom: Decorator = (Story) => (
  <Box as="main" className="overflow-clip">
    <Text className="flex h-screen items-center justify-center text-foreground-muted">
      Scroll down ↓
    </Text>
    <Story />
    <Box className="h-screen" />
  </Box>
);

/**
 * Answers the listed media queries with the given result, the others as the browser does: the
 * stories emulate reduced motion or a phone without resizing the canvas. Returns the restore.
 */
function emulateMediaQueries(answers: Record<string, boolean>): () => void {
  const browserMatchMedia = window.matchMedia;
  window.matchMedia = (query: string) => {
    const answer = answers[query];
    if (answer === undefined) return browserMatchMedia.call(window, query);
    return {
      matches: answer,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  };
  return () => {
    window.matchMedia = browserMatchMedia;
  };
}

const meta = {
  title: 'Pages/Home/ExperienceSection',
  component: ExperienceSection,
  parameters: { layout: 'fullscreen' },
  decorators: [withScrollRoom],
  // Fixture content: stories never fetch from Sanity.
  args: {
    title: HOME_CONTENT_FIXTURE.sectionTitles.experience,
    jobs,
  },
} satisfies Meta<typeof ExperienceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Each job in its sector: the two PulseLife jobs share the MedTech sector, so they match.
 * Scroll the canvas: the section pins and walks through the jobs, two open at a time (one under
 * 700px), the rail filling towards the next one. Clicking a collapsed card or a dot scrolls to it.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The company names are the disclosure buttons (the dots add the dates to theirs).
    const [firstJob, secondJob, thirdJob] = canvas.getAllByRole('button', {
      name: /^(Saper Vedere|PulseLife)$/,
    });
    await expect(firstJob).toHaveAttribute('aria-expanded', 'true');
    await expect(secondJob).toHaveAttribute('aria-expanded', 'true');
    await expect(thirdJob).toHaveAttribute('aria-expanded', 'false');
    if (!thirdJob) return;
    await userEvent.click(thirdJob);
    await waitFor(() => expect(thirdJob).toHaveAttribute('aria-expanded', 'true'), {
      timeout: 3000,
    });
    await expect(firstJob).toHaveAttribute('aria-expanded', 'false');
  },
};

/** Reduced motion: no pinning, no animation; every card open in a plain list on a full rail. */
export const ReducedMotion: Story = {
  beforeEach: () =>
    emulateMediaQueries({
      '(prefers-reduced-motion: reduce)': true,
      '(prefers-reduced-motion: no-preference)': false,
    }),
};

/** Under 700px a single card is open at a time. */
export const Mobile: Story = {
  beforeEach: () => emulateMediaQueries({ '(min-width: 700px)': false }),
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

/** The production content before the owner links the jobs to sectors (#24). */
export const WithoutSector: Story = {
  args: { jobs: jobs.map((job) => ({ ...job, sector: null })) },
};

export const WithoutSummary: Story = {
  args: { jobs: jobs.map((job) => ({ ...job, summary: null })) },
};

/** One card per sector tint, to check the label contrast of each in both themes (plain list). */
export const AllTints: Story = {
  beforeEach: () => emulateMediaQueries({ '(prefers-reduced-motion: no-preference)': false }),
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
