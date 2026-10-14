/**
 * Seeds the dataset with the portfolio content (ADR-003): `pnpm studio:seed` (or, from `studio/`,
 * `pnpm seed`) runs it through `sanity exec --with-user-token`, so it writes with your own login and
 * no token is stored. Idempotent: fixed `_id`s and `_key`s, `createOrReplace` in one transaction,
 * images uploaded by content hash (an upload of the same file returns the same asset). It ends by
 * running `pnpm content:check` against the seeded dataset, and exits 1 when the check fails.
 *
 * It refuses to run (exit 1, nothing written) while a seeded document has a Studio draft, which
 * would be discarded: pass `--discard-drafts` (`pnpm studio:seed --discard-drafts`) to delete them.
 *
 * Target another dataset with `SANITY_STUDIO_DATASET=development pnpm studio:seed`.
 */
import { spawnSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getCliClient } from 'sanity/cli';
import { HOME_CONTENT_FIXTURE } from '../../src/_pages/home/model/content.fixture';
import { buildDocuments, seedDocumentIds } from './documents';
import { decideOnDrafts, draftId, isDiscardDraftsAllowed } from './drafts';

const API_VERSION = '2026-10-01';

/** Project screenshots and the avatar, from `studio/seed/assets/`. */
const SCREENSHOT_FILES: Record<string, string> = {
  'project-meeple': 'meeple-dashboard.png',
  'project-maillons': 'maillons-site.png',
};
const AVATAR_FILE = 'carlos.png';

const REPOSITORY_ROOT = fileURLToPath(new URL('../../', import.meta.url));

const client = getCliClient({ apiVersion: API_VERSION });

async function findDrafts(documentIds: readonly string[]): Promise<string[]> {
  // `raw`: the default `published` perspective of recent API versions hides drafts.
  return client.fetch<string[]>(
    '*[_id in $ids]._id',
    { ids: documentIds.map(draftId) },
    { perspective: 'raw' },
  );
}

async function uploadImage(fileName: string): Promise<string> {
  const path = fileURLToPath(new URL(`./assets/${fileName}`, import.meta.url));
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename: fileName,
  });
  console.log(`  image ${fileName} → ${asset._id}`);
  return asset._id;
}

async function uploadAssets() {
  const avatar = await uploadImage(AVATAR_FILE);
  const screenshots: Record<string, string> = {};
  for (const [projectId, fileName] of Object.entries(SCREENSHOT_FILES)) {
    screenshots[projectId] = await uploadImage(fileName);
  }
  return { avatar, screenshots };
}

/**
 * Runs the site's `pnpm content:check` against the dataset just seeded; true when it passes. A
 * child process, because the site validates its env at import time: the variables set here take
 * precedence over `.env.local`, and CI runs the very same command.
 */
function runContentCheck(projectId: string, dataset: string): boolean {
  const result = spawnSync('pnpm', ['content:check'], {
    cwd: REPOSITORY_ROOT,
    stdio: 'inherit',
    env: { ...process.env, SANITY_PROJECT_ID: projectId, SANITY_DATASET: dataset },
  });
  if (result.error) throw result.error;
  return result.status === 0;
}

async function seed() {
  const { projectId, dataset } = client.config();
  if (!projectId || !dataset) throw new Error('The Sanity CLI client has no projectId or dataset');
  console.log(`Seeding ${projectId}/${dataset}…`);

  const drafts = await findDrafts(seedDocumentIds(HOME_CONTENT_FIXTURE));
  const decision = decideOnDrafts(drafts, isDiscardDraftsAllowed(process.argv));
  if (!decision.canSeed) {
    console.error(decision.message);
    process.exitCode = 1;
    return;
  }
  if (decision.message) console.log(decision.message);

  const documents = buildDocuments(HOME_CONTENT_FIXTURE, await uploadAssets());
  const transaction = client.transaction();
  for (const document of documents) transaction.createOrReplace(document);
  for (const draft of drafts) transaction.delete(draft);
  await transaction.commit({ visibility: 'sync' });

  console.log(`  ${documents.length} documents published:`);
  for (const document of documents) console.log(`    ${document._type} "${document._id}"`);

  if (!runContentCheck(projectId, dataset)) process.exitCode = 1;
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
