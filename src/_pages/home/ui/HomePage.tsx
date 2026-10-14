import type { Metadata } from 'next';
import { DEFAULT_LOCALE } from '@/shared/lib/i18n';
import { getHomeContent } from '../api/getHomeContent';
import { HomeView } from './HomeView';

/**
 * `<head>` of the page, from the Sanity SEO fields. The static HTML has no per-locale URL, so it
 * uses the default locale (ADR-003).
 */
export async function generateHomeMetadata(): Promise<Metadata> {
  const { site } = await getHomeContent();
  return {
    title: site.seo.title[DEFAULT_LOCALE],
    description: site.seo.description[DEFAULT_LOCALE],
  };
}

/** The portfolio page: content fetched from Sanity at build time, both locales shipped. */
export async function HomePage() {
  const content = await getHomeContent();
  return <HomeView content={content} />;
}
