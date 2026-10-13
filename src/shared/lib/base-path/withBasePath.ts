/**
 * Prefixes a root-relative public asset URL (`/resume.pdf`) with the deploy base path
 * (`/portfolio` on GitHub Pages). `next/link` adds the base path itself; `next/image` sources,
 * plain `<a href>` and downloads do not, so they go through this helper.
 *
 * Absolute (`https://…`), protocol-relative (`//…`), relative and empty URLs are returned as is.
 * The default reads `NEXT_PUBLIC_BASE_PATH`, inlined at build time and validated by
 * `src/shared/config/env.ts`.
 */
export function withBasePath(
  url: string,
  basePath: string = process.env.NEXT_PUBLIC_BASE_PATH ?? '',
): string {
  if (!basePath || !url.startsWith('/') || url.startsWith('//')) return url;
  return `${basePath}${url}`;
}
