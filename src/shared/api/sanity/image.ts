import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { sanityConfig } from './config';

/**
 * URL builder of a Sanity image (`urlFor(image).width(800).auto('format').url()`). The Sanity CDN
 * resizes, since `next/image` is unoptimized on GitHub Pages. URLs are absolute
 * (`https://cdn.sanity.io/…`), so the deploy base path never applies to them.
 */
export function urlFor(source: SanityImageSource) {
  const { projectId, dataset } = sanityConfig();
  return createImageUrlBuilder({ projectId, dataset }).image(source);
}
