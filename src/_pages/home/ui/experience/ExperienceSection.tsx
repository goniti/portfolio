'use client';

import { Flex, Text } from 'goniui';
import { useMessages } from '@/shared/lib/i18n';
import { Surface, Tag } from '@/shared/ui/atoms';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import { JOBS } from '../../model/experience';
import { tintVariants } from '../tint';
import { experienceMessages } from './messages';

/** Career timeline: one glass card per job along a gradient rail. */
export function ExperienceSection() {
  const copy = useMessages(experienceMessages);

  return (
    <PageSection id="experience" labelledBy="experience-title">
      <SectionHeading eyebrow={copy.eyebrow} title={copy.title} titleId="experience-title" />
      <Flex
        as="ol"
        direction="col"
        className="relative gap-5 pl-8 before:absolute before:inset-y-2.5 before:left-1.75 before:w-0.5 before:rounded-xs before:bg-timeline-rail"
      >
        {JOBS.map((job) => {
          const jobCopy = copy.jobs[job.id];
          return (
            <Surface
              key={job.id}
              as="li"
              radius="md"
              hover="lift"
              blur
              className="relative flex flex-wrap gap-x-10 gap-y-5 p-5 md:p-7"
            >
              <span
                aria-hidden="true"
                className={tintVariants({
                  tint: job.tint,
                  className:
                    'absolute top-8 -left-8 size-4 rounded-full border-2 border-current bg-background glow-current-lg',
                })}
              />
              <Flex direction="col" gap="sm" className="shrink basis-60">
                <Text
                  as="span"
                  variant="bodySm"
                  className="font-mono font-medium text-foreground-subtle"
                >
                  {jobCopy.dates}
                </Text>
                <Text
                  as="h3"
                  variant="h2"
                  className="text-2xl leading-tight font-bold tracking-tight"
                >
                  {jobCopy.company}
                </Text>
                <Text as="span" variant="bodyLg" className="font-medium text-accent-indigo">
                  {jobCopy.role}
                </Text>
                <Flex
                  as="ul"
                  wrap="wrap"
                  aria-label={copy.technologiesLabel}
                  className="mt-1.5 gap-1.5"
                >
                  {job.technologies.map((technology) => (
                    <li key={technology}>
                      <Tag>{technology}</Tag>
                    </li>
                  ))}
                </Flex>
              </Flex>
              <Flex as="ul" direction="col" gap="md" className="grow basis-80">
                {jobCopy.achievements.map((achievement) => (
                  <Flex
                    as="li"
                    key={achievement}
                    gap="md"
                    className="text-base leading-relaxed text-foreground-soft"
                  >
                    <span
                      aria-hidden="true"
                      className={tintVariants({
                        tint: job.tint,
                        className: 'mt-2.25 size-1.5 flex-none rounded-xs bg-current',
                      })}
                    />
                    <span>{achievement}</span>
                  </Flex>
                ))}
              </Flex>
            </Surface>
          );
        })}
      </Flex>
    </PageSection>
  );
}
