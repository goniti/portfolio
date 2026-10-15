/**
 * `pnpm content:check` (ADR-003): fetches the published content with the same query and schemas
 * as the build, with no fallback, and prints every problem (document › field › locale). Exits 1
 * on any problem, so CI and the deploy fail before `next build`.
 */
import { getHomeContent } from '@/_pages/home';
import { ContentError } from '@/shared/api';
import { env } from '@/shared/config';

async function checkContent(): Promise<void> {
  const target = `${env.SANITY_PROJECT_ID}/${env.SANITY_DATASET}`;
  try {
    const content = await getHomeContent('fail');
    console.log(
      `Content OK (${target}): ${content.jobs.length} jobs, ${content.projects.length} projects, ${content.notes.length} watch notes, every field in every locale.`,
    );
    if (!content.site.person) {
      console.warn(
        'Reminder: siteSettings › person is not filled yet; the hero keeps its tagline as the heading. Fill it in the Studio (Site settings › Identity).',
      );
    }
  } catch (error) {
    if (!(error instanceof ContentError)) throw error;
    console.error(`Content check failed (${target}).\n${error.message}`);
    process.exitCode = 1;
  }
}

await checkContent();
