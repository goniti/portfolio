import { describe, expect, it } from 'vitest';
import { SECTORS_FIXTURE } from './content.fixture';
import { DEFAULT_JOB_TINT, jobTint } from './sector';

describe('jobTint', () => {
  it('takes the tint of the job sector', () => {
    expect(jobTint({ sector: SECTORS_FIXTURE.medTech })).toBe('emerald');
  });

  it('falls back to the default tint until the job has a sector', () => {
    expect(jobTint({ sector: null })).toBe(DEFAULT_JOB_TINT);
  });
});
