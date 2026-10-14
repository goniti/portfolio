import { z } from 'zod';

/**
 * Sub-path the site is served from: empty at the domain root (`pnpm dev`, e2e), `/portfolio` on
 * the GitHub Pages project page. Starts with `/`, no trailing slash.
 */
const BasePathSchema = z
  .string()
  .regex(/^(\/[\w.~-]+)*$/, 'must be empty or look like "/portfolio" (no trailing slash)')
  .default('');

/** Sanity API version, pinned (never `latest`): a date such as `2026-10-01`. */
const ApiVersionSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a pinned date such as "2026-10-01"')
  .default('2026-10-01');

/** An empty variable (an unset GitHub Actions `vars.X` expands to "") counts as unset. */
const unsetIfEmpty = (value: unknown) => (value === '' ? undefined : value);

// Server-side variables only: client code reads `process.env.NEXT_PUBLIC_*` directly.
const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_BASE_PATH: BasePathSchema,
    // Sanity (ADR-003): read at build time only, never shipped to the browser, never secret
    // (the dataset is public).
    SANITY_PROJECT_ID: z.preprocess(
      unsetIfEmpty,
      z
        .string()
        .regex(/^[a-z0-9-]+$/, 'must be a Sanity project ID such as "8i6zw2b7"')
        .optional(),
    ),
    SANITY_DATASET: z.preprocess(
      unsetIfEmpty,
      z
        .string()
        .regex(/^[a-z0-9][\w-]{0,63}$/, 'must be a Sanity dataset name')
        .default('production'),
    ),
    SANITY_API_VERSION: z.preprocess(unsetIfEmpty, ApiVersionSchema),
  })
  .superRefine((value, context) => {
    // `pnpm dev` and `pnpm build` fetch the content; unit tests and Storybook never do.
    if (value.NODE_ENV === 'test' || value.SANITY_PROJECT_ID) return;
    context.addIssue({
      code: 'custom',
      path: ['SANITY_PROJECT_ID'],
      message: 'is required to fetch the content: copy .env.example to .env.local',
    });
  });

/**
 * Validates the environment once: `next.config.ts` calls it, so `next dev` and
 * `next build` stop immediately on an invalid or missing variable.
 */
export function loadEnv(source: Record<string, string | undefined> = process.env) {
  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const env = loadEnv();
