/** Opt-in to delete the Studio drafts of the seeded documents: `pnpm studio:seed --discard-drafts`. */
const DISCARD_DRAFTS_FLAG = '--discard-drafts';

export interface DraftDecision {
  canSeed: boolean;
  message?: string;
}

export function draftId(documentId: string): string {
  return `drafts.${documentId}`;
}

export function isDiscardDraftsAllowed(argv: readonly string[]): boolean {
  return argv.includes(DISCARD_DRAFTS_FLAG);
}

/**
 * A draft would hide the seeded version in the Studio, but it may hold in-progress edits: the
 * seed only deletes drafts when explicitly told to, and refuses otherwise.
 */
export function decideOnDrafts(
  draftIds: readonly string[],
  isDiscardAllowed: boolean,
): DraftDecision {
  if (draftIds.length === 0) return { canSeed: true };
  const list = draftIds.map((id) => `    ${id}`).join('\n');
  if (isDiscardAllowed) {
    return { canSeed: true, message: `  Discarding ${draftIds.length} draft(s):\n${list}` };
  }
  return {
    canSeed: false,
    message: `Refusing to seed: ${draftIds.length} seeded document(s) have unpublished Studio drafts, which the seed would discard:\n${list}\nPublish or discard them in the Studio, or run again with ${DISCARD_DRAFTS_FLAG}.`,
  };
}
