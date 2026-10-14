import { cache } from 'react';
import { fetchContent, type FallbackPolicy } from '@/shared/api';
import { homeContentSchema, type HomeContent } from '../model/content';
import { HOME_CONTENT_QUERY } from './queries';

/**
 * The home page content, fetched once per build (the page and its metadata share it). Throws on
 * any problem, so `next build` fails with the full report (ADR-003).
 */
export const getHomeContent = cache((fallback?: FallbackPolicy): Promise<HomeContent> =>
  fetchContent({ query: HOME_CONTENT_QUERY, schema: homeContentSchema, fallback }),
);
