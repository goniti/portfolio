/**
 * Seeds the dataset with the portfolio content (ADR-003): `pnpm studio:seed` (or, from `studio/`,
 * `pnpm seed`) runs it through `sanity exec --with-user-token`, so it writes with your own login and
 * no token is stored. Idempotent: fixed `_id`s and `_key`s, `createOrReplace` in one transaction,
 * images uploaded by content hash (an upload of the same file returns the same asset).
 *
 * Target another dataset with `SANITY_STUDIO_DATASET=development pnpm studio:seed`.
 */
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getCliClient } from 'sanity/cli';
import { HOME_CONTENT_FIXTURE } from '../../src/_pages/home/model/content.fixture';
import { buildDocuments } from './documents';

const API_VERSION = '2026-10-01';

/** Project screenshots and the avatar, from `studio/seed/assets/`. */
const SCREENSHOT_FILES: Record<string, string> = {
  'project-meeple': 'meeple-dashboard.png',
  'project-maillons': 'maillons-site.png',
};
const AVATAR_FILE = 'carlos.png';

const client = getCliClient({ apiVersion: API_VERSION });

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

async function seed() {
  const { projectId, dataset } = client.config();
  console.log(`Seeding ${projectId}/${dataset}…`);

  const documents = buildDocuments(HOME_CONTENT_FIXTURE, await uploadAssets());
  const transaction = client.transaction();
  for (const document of documents) {
    transaction.createOrReplace(document);
    // A draft left over from an earlier edit would hide the seeded version in the Studio.
    transaction.delete(`drafts.${document._id}`);
  }
  await transaction.commit({ visibility: 'sync' });

  console.log(`  ${documents.length} documents published:`);
  for (const document of documents) console.log(`    ${document._type} "${document._id}"`);
  console.log('Done. Run `pnpm content:check` from the repository root to validate them.');
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
