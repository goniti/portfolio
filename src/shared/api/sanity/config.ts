import { env, SANITY_PROJECT_ID_REQUIRED } from '../../config';
import { ContentError } from './report';

interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

export function sanityConfig(): SanityConfig {
  if (!env.SANITY_PROJECT_ID) {
    throw new ContentError(SANITY_PROJECT_ID_REQUIRED);
  }
  return {
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    apiVersion: env.SANITY_API_VERSION,
  };
}
