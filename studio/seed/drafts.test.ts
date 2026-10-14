import { describe, expect, it } from 'vitest';
import { decideOnDrafts, draftId, isDiscardDraftsAllowed } from './drafts';

describe('isDiscardDraftsAllowed', () => {
  it('reads the flag wherever `sanity exec` and pnpm put it', () => {
    expect(isDiscardDraftsAllowed(['node', 'seed.ts', '--discard-drafts'])).toBe(true);
    expect(isDiscardDraftsAllowed(['node', 'seed.ts', '--', '--discard-drafts'])).toBe(true);
    expect(isDiscardDraftsAllowed(['node', 'seed.ts'])).toBe(false);
  });
});

describe('decideOnDrafts', () => {
  const drafts = [draftId('homePage'), draftId('job-saper-vedere')];

  it('seeds when no draft exists, with or without the flag', () => {
    expect(decideOnDrafts([], false)).toEqual({ canSeed: true });
    expect(decideOnDrafts([], true)).toEqual({ canSeed: true });
  });

  it('refuses and lists the drafts without the flag', () => {
    const decision = decideOnDrafts(drafts, false);
    expect(decision.canSeed).toBe(false);
    expect(decision.message).toContain('drafts.homePage');
    expect(decision.message).toContain('drafts.job-saper-vedere');
    expect(decision.message).toContain('--discard-drafts');
  });

  it('seeds and lists the discarded drafts with the flag', () => {
    const decision = decideOnDrafts(drafts, true);
    expect(decision.canSeed).toBe(true);
    expect(decision.message).toContain('Discarding 2 draft(s)');
    expect(decision.message).toContain('drafts.homePage');
  });
});
