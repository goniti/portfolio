'use client';

import { Flex, Text } from 'goniui';
import { tv } from 'tailwind-variants';
import { type Localized, useLocalized, useMessages } from '@/shared/lib/i18n';
import { REVEAL } from '@/shared/lib/motion';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import type { Job } from '../../model/content';
import { useJobTimeline } from '../../model/useJobTimeline';
import { JobCard } from './JobCard';
import { experienceMessages } from './messages';
import { TimelineRail } from './TimelineRail';

/** Pinned: a tall track (sized by the step count) holding a panel stuck under the navigation. */
const trackVariants = tv({
  variants: {
    pinned: { true: 'timeline-track', false: '' },
  },
});

const panelVariants = tv({
  base: 'relative flex flex-col gap-3 pl-9',
  variants: {
    pinned: { true: 'sticky top-19 sm:top-21', false: '' },
  },
});

export interface ExperienceSectionProps {
  title: Localized<string>;
  jobs: readonly Job[];
}

/**
 * Career timeline. While the page scrolls through it, the section stays pinned and walks
 * through the jobs: two cards open at a time on wide screens (one on narrow ones), the others
 * collapse, and a glowing rail fills towards the next job. With reduced motion, before
 * hydration or without JavaScript, every card is open in a plain list along a full rail.
 */
export function ExperienceSection({ title, jobs }: ExperienceSectionProps) {
  const localize = useLocalized();
  const copy = useMessages(experienceMessages);
  const { pinned, trackRef, panelRef, counter, reachedEnd, cardState, openCard } = useJobTimeline(
    jobs.length,
  );

  return (
    <PageSection id="experience" labelledBy="experience-title">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={localize(title)}
        titleId="experience-title"
        {...REVEAL.zoom}
      />
      {/* Plain elements: goniui's layout primitives take no ref. */}
      <div ref={trackRef} className={trackVariants({ pinned })}>
        <div ref={panelRef} className={panelVariants({ pinned })}>
          {pinned ? (
            <Flex aria-hidden="true" justify="between" align="center" gap="md">
              <Text
                as="span"
                variant="caption"
                className="font-medium font-mono text-foreground-soft"
              >
                {copy.counter(counter)}
              </Text>
              <Text
                as="span"
                variant="caption"
                className="font-medium font-mono text-2xs text-foreground-subtle uppercase tracking-widest"
              >
                {copy.scrollHint} {copy.scrollHintGlyph}
              </Text>
            </Flex>
          ) : null}
          <TimelineRail lit={reachedEnd} />
          <Flex as="ol" direction="col" className="gap-2.5" {...REVEAL.stagger}>
            {jobs.map((job, jobIndex) => (
              <JobCard
                key={job.id}
                job={job}
                state={cardState(jobIndex)}
                onOpen={() => openCard(jobIndex)}
              />
            ))}
          </Flex>
        </div>
      </div>
    </PageSection>
  );
}
