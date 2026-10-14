import { createClient, type SanityClient } from '@sanity/client';
import { sanityConfig } from './config';

let client: SanityClient | undefined;

/**
 * Read-only client of the public dataset: published documents only, fresh from the API (no CDN,
 * so a build started by the publish webhook sees the new content). No token.
 */
export function getSanityClient(): SanityClient {
  client ??= createClient({ ...sanityConfig(), useCdn: false, perspective: 'published' });
  return client;
}
