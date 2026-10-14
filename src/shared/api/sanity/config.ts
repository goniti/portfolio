import { env } from '../../config';
import { ContentError } from './report';

interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

/** Project, dataset and pinned API version, from the validated environment. */
export function sanityConfig(): SanityConfig {
  if (!env.SANITY_PROJECT_ID) {
    throw new ContentError('SANITY_PROJECT_ID is not set: copy .env.example to .env.local');
  }
  return {
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    apiVersion: env.SANITY_API_VERSION,
  };
}
