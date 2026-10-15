'use client';

import { Flex, Text } from 'goniui';
import { useLocale, useLocalized, useMessages, type Localized } from '@/shared/lib/i18n';
import { REVEAL } from '@/shared/lib/motion';
import { Surface, Tag } from '@/shared/ui/atoms';
import { SectionHeading } from '@/shared/ui/molecules';
import { PageSection } from '@/shared/ui/templates';
import type { Job } from '../../model/content';
import { formatPeriod } from '../../model/format';
import { jobTint } from '../../model/sector';
import { tintVariants } from '../tint';
import { experienceMessages } from './messages';

export interface ExperienceSectionProps {
  title: Localized<string>;
  jobs: readonly Job[];
}

/**
 * Career timeline: one glass card per job along a gradient rail. The job's sector tints the card
 * (label, top line, dot, bullets); a job without a sector shows no label and no top line.
 */
export function ExperienceSection({ title, jobs }: ExperienceSectionProps) {
  const { locale } = useLocale();
  const localize = useLocalized();
  const copy = useMessages(experienceMessages);

  return (
    <PageSection id="experience" labelledBy="experience-title">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={localize(title)}
        titleId="experience-title"
        {...REVEAL.zoom}
      />
      <Flex
        as="ol"
        direction="col"
        {...REVEAL.stagger}
        className="relative gap-5 pl-8 before:absolute before:inset-y-2.5 before:left-1.75 before:w-0.5 before:rounded-xs before:bg-timeline-rail"
      >
        {jobs.map((job) => (
          <Surface
            key={job.id}
            as="li"
            radius="md"
            hover="lift"
            blur
            className="group relative flex flex-wrap gap-x-10 gap-y-5 p-5 md:p-7"
          >
            {job.sector ? (
              <span
                aria-hidden="true"
                className={tintVariants({
                  tint: jobTint(job),
                  className:
                    'absolute inset-x-6 -top-px h-px bg-linear-to-r from-transparent via-current to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100',
                })}
              />
            ) : null}
            <span
              aria-hidden="true"
              className={tintVariants({
                tint: jobTint(job),
                className:
                  'glow-current-lg absolute top-8 -left-8 size-4 rounded-full border-2 border-current bg-background',
              })}
            />
            <Flex direction="col" gap="sm" className="shrink basis-60">
              {job.sector ? (
                <Text
                  as="span"
                  variant="caption"
                  className={tintVariants({
                    tint: jobTint(job),
                    className:
                      'flex items-center gap-2 font-mono font-semibold text-2xs uppercase tracking-widest before:h-px before:w-4 before:bg-current',
                  })}
                >
                  {localize(job.sector.name)}
                </Text>
              ) : null}
              <Text
                as="span"
                variant="bodySm"
                className="font-medium font-mono text-foreground-subtle"
              >
                {formatPeriod(job.startDate, job.endDate, locale, copy.present)}
              </Text>
              <Text
                as="h3"
                variant="h2"
                className="font-bold text-2xl leading-tight tracking-tight"
              >
                {job.company}
              </Text>
              <Text as="span" variant="bodyLg" className="font-medium text-accent-indigo">
                {localize(job.role)}
              </Text>
              {job.summary ? (
                <Text as="p" variant="body" className="text-foreground-muted leading-relaxed">
                  {localize(job.summary)}
                </Text>
              ) : null}
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
              {job.achievements.map((achievement) => (
                <Flex
                  as="li"
                  key={localize(achievement)}
                  gap="md"
                  className="text-base text-foreground-soft leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className={tintVariants({
                      tint: jobTint(job),
                      className: 'mt-2.25 size-1.5 flex-none rounded-xs bg-current',
                    })}
                  />
                  <span>{localize(achievement)}</span>
                </Flex>
              ))}
            </Flex>
          </Surface>
        ))}
      </Flex>
    </PageSection>
  );
}
