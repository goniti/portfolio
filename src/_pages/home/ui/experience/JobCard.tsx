import * as Collapsible from 'goniui/collapsible';
import { Flex, Text } from 'goniui';
import { tv } from 'tailwind-variants';
import { useLocale, useLocalized, useMessages } from '@/shared/lib/i18n';
import { Surface, Tag } from '@/shared/ui/atoms';
import type { Job } from '../../model/content';
import { formatPeriod } from '../../model/format';
import { jobTint } from '../../model/sector';
import type { TimelineCardState } from '../../model/useJobTimeline';
import { RAIL_ANCHOR, RAIL_ITEM } from '../../model/useTimelineRail';
import { tintVariants } from '../tint';
import { experienceMessages } from './messages';
import { TimelineDot } from './TimelineDot';

/**
 * Open cards are highlighted. Past and future ones are dimmed through their text tokens, not
 * their opacity, so every text keeps its contrast (axe, `a11y.test: error`).
 */
const cardVariants = tv({
  base: 'collapsible-manual group relative flex flex-col px-4.5 py-4 duration-500 md:px-6.5 md:py-5.5',
  variants: {
    state: {
      open: 'border-tint-indigo/40 shadow-lift-indigo',
      past: 'hover:border-border-strong',
      future: 'hover:border-border-strong',
      listed: '',
    },
  },
});

/** The sector's gradient hairline along the top edge: shown on open cards only. */
const hairlineVariants = tv({
  base: 'absolute inset-x-6 -top-px h-px bg-linear-to-r from-transparent via-current to-transparent transition-opacity duration-400',
  variants: {
    state: {
      open: 'opacity-70',
      past: 'opacity-0',
      future: 'opacity-0',
      listed: 'opacity-60 group-hover:opacity-100',
    },
  },
});

const companyVariants = tv({
  base: 'font-bold leading-tight tracking-tight transition-all duration-450 ease-spring group-hover:text-foreground',
  variants: {
    state: {
      open: 'text-2xl text-foreground',
      past: 'text-foreground-muted text-xl',
      future: 'text-foreground-subtle text-xl',
      listed: 'text-2xl text-foreground',
    },
  },
});

/**
 * The body's single grid row grows from 0fr to 1fr: a height transition to the content's size.
 * Its spacing from the header is padding on this grid, which folds with it (padding on the row
 * would keep the folded row open by that much).
 */
const bodyVariants = tv({
  base: 'grid transition-all duration-600 ease-spring',
  variants: {
    unfolded: {
      true: 'grid-rows-[1fr] pt-4',
      false: 'grid-rows-[0fr] pt-0',
    },
  },
});

/** Summary and technologies: fade in and rise as the card unfolds. */
const asideVariants = tv({
  base: 'shrink basis-65 transition duration-550 ease-spring',
  variants: {
    unfolded: {
      true: 'translate-y-0 opacity-100 delay-100',
      false: 'translate-y-2.5 opacity-0',
    },
  },
});

/** Achievements slide in one after the other (180ms, then 80ms apart); they leave at once. */
const ACHIEVEMENT_DELAYS = [
  'delay-180',
  'delay-260',
  'delay-340',
  'delay-420',
  'delay-500',
  'delay-580',
] as const;

const achievementVariants = tv({
  base: 'text-base text-foreground-soft leading-relaxed transition duration-550 ease-spring',
  variants: {
    unfolded: {
      true: 'translate-x-0 opacity-100',
      false: '-translate-x-2.5 opacity-0',
    },
  },
});

function achievementDelay(achievementIndex: number): string {
  return ACHIEVEMENT_DELAYS[Math.min(achievementIndex, ACHIEVEMENT_DELAYS.length - 1)] ?? '';
}

export interface JobCardProps {
  job: Job;
  state: TimelineCardState;
  /** Scrolls the timeline to the step opening this card. */
  onOpen: () => void;
}

/**
 * One job of the timeline. Collapsed, it shows its header only (sector, company, role, dates)
 * and its body is `inert`; the company name is the disclosure button. The body unfolds through
 * its grid rows, so the rail and the dots follow the card height as it moves.
 */
export function JobCard({ job, state, onOpen }: JobCardProps) {
  const { locale } = useLocale();
  const localize = useLocalized();
  const copy = useMessages(experienceMessages);
  const tint = jobTint(job);
  const period = formatPeriod(job.startDate, job.endDate, locale, copy.present);
  const unfolded = state === 'open' || state === 'listed';
  const pinned = state !== 'listed';

  return (
    <Collapsible.Root asChild open={unfolded} onOpenChange={onOpen}>
      <Surface
        as="li"
        radius="md"
        hover={pinned ? 'none' : 'lift'}
        blur
        {...RAIL_ITEM}
        className={cardVariants({ state })}
      >
        {job.sector ? (
          <span
            aria-hidden="true"
            className={hairlineVariants({ state, className: tintVariants({ tint }) })}
          />
        ) : null}
        <TimelineDot
          state={state}
          tint={tint}
          label={copy.dotLabel(job.company, period)}
          onOpen={onOpen}
        />
        <Flex wrap="wrap" align="end" justify="between" className="gap-x-6 gap-y-2">
          <Flex direction="col" gap="sm" className="min-w-0">
            {job.sector ? (
              <Text
                as="span"
                variant="caption"
                className={tintVariants({
                  tint,
                  className:
                    'flex items-center gap-2.5 font-mono font-semibold text-2xs uppercase tracking-widest before:h-px before:w-5.5 before:flex-none before:bg-linear-to-r before:from-transparent before:to-current',
                })}
              >
                {localize(job.sector.name)}
              </Text>
            ) : null}
            <Flex wrap="wrap" align="baseline" className="gap-x-3.5 gap-y-1">
              <Text as="h3" variant="h2" {...RAIL_ANCHOR} className={companyVariants({ state })}>
                {pinned ? (
                  <Collapsible.Trigger
                    onFocus={unfolded ? undefined : onOpen}
                    className="rounded-sm text-left data-[state=closed]:cursor-pointer data-[state=closed]:after:absolute data-[state=closed]:after:inset-0 data-[state=closed]:after:rounded-2xl"
                  >
                    {job.company}
                  </Collapsible.Trigger>
                ) : (
                  job.company
                )}
              </Text>
              <Text as="span" variant="bodyLg" className="font-medium text-accent-indigo">
                {localize(job.role)}
              </Text>
            </Flex>
          </Flex>
          <Text as="span" variant="bodySm" className="font-medium font-mono text-foreground-subtle">
            {period}
          </Text>
        </Flex>
        <Collapsible.Content forceMount inert={!unfolded} className={bodyVariants({ unfolded })}>
          <Flex wrap="wrap" className="min-h-0 gap-x-10 gap-y-3.5">
            <Flex direction="col" gap="md" className={asideVariants({ unfolded })}>
              {job.summary ? (
                <Text as="p" variant="body" className="text-foreground-muted leading-relaxed">
                  {localize(job.summary)}
                </Text>
              ) : null}
              <Flex as="ul" wrap="wrap" aria-label={copy.technologiesLabel} className="gap-1.5">
                {job.technologies.map((technology) => (
                  <li key={technology}>
                    <Tag>{technology}</Tag>
                  </li>
                ))}
              </Flex>
            </Flex>
            <Flex as="ul" direction="col" gap="sm" className="grow basis-75">
              {job.achievements.map((achievement, achievementIndex) => (
                <Flex
                  as="li"
                  key={localize(achievement)}
                  gap="md"
                  className={achievementVariants({
                    unfolded,
                    className: unfolded ? achievementDelay(achievementIndex) : undefined,
                  })}
                >
                  <span
                    aria-hidden="true"
                    className={tintVariants({
                      tint,
                      className: 'mt-2.25 size-1.5 flex-none rounded-xs bg-current',
                    })}
                  />
                  <span>{localize(achievement)}</span>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Collapsible.Content>
      </Surface>
    </Collapsible.Root>
  );
}
