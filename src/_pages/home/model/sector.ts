import type { Tint } from 'portfolio-content-model';
import type { Job } from './content';

/** Tint of a job not linked to a sector yet (#24): the colour at the top of the timeline rail. */
export const DEFAULT_JOB_TINT = 'indigo' satisfies Tint;

/** The tint of a job's card: its sector's, or the default one until it has a sector. */
export function jobTint({ sector }: Pick<Job, 'sector'>): Tint {
  return sector?.tint ?? DEFAULT_JOB_TINT;
}
