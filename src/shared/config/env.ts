import { z } from 'zod';
import { CALENDLY_PAGE_PATTERN, DEFAULT_SITE_URL } from './clientEnv';

/** Why the content cannot be fetched without a Sanity project ID, and how to fix it. */
export const SANITY_PROJECT_ID_REQUIRED =
  'SANITY_PROJECT_ID is required to fetch the content: copy .env.example to .env.local';

/** An empty variable (an unset GitHub Actions `vars.X` expands to "") counts as unset. */
const unsetIfEmpty = (value: unknown) => (value === '' ? undefined : value);

/**
 * The public variables (`clientEnv`) plus the build-time ones. Built on first call, never on
 * import: the browser loads this module through the `shared/config` barrel (for `clientEnv`), and
 * a module without top-level work lets the production build drop zod from the client bundle.
 */
function buildEnvSchema() {
  return z
    .object({
      NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
      NEXT_PUBLIC_SITE_URL: z.url().default(DEFAULT_SITE_URL),
      NEXT_PUBLIC_BASE_PATH: z
        .string()
        // eslint-disable-next-line security/detect-unsafe-regex -- each repeated segment starts with the `/` its class excludes: linear, no backtracking
        .regex(/^(\/[\w.~-]+)*$/, 'must be empty or look like "/portfolio" (no trailing slash)')
        .default(''),
      NEXT_PUBLIC_CALENDLY_URL: z.preprocess(
        unsetIfEmpty,
        z
          .url()
          .regex(
            CALENDLY_PAGE_PATTERN,
            'must be a Calendly page such as "https://calendly.com/<user>/<event>"',
          )
          .optional(),
      ),
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
      // Pinned (never `latest`): a date such as `2026-10-01`.
      SANITY_API_VERSION: z.preprocess(
        unsetIfEmpty,
        z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a pinned date such as "2026-10-01"')
          .default('2026-10-01'),
      ),
    })
    .superRefine((value, context) => {
      // `pnpm dev` and `pnpm build` fetch the content; unit tests and Storybook never do.
      if (value.NODE_ENV === 'test' || value.SANITY_PROJECT_ID) return;
      context.addIssue({
        code: 'custom',
        path: ['SANITY_PROJECT_ID'],
        message: SANITY_PROJECT_ID_REQUIRED,
      });
    });
}

type Env = z.output<ReturnType<typeof buildEnvSchema>>;

/**
 * Validates the environment once: `next.config.ts` calls it, so `next dev` and `next build` stop
 * immediately on an invalid or missing variable, public ones included. Throws one error listing
 * every invalid variable.
 */
export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const result = buildEnvSchema().safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

let validated: Env | undefined;

function serverEnv(): Env {
  validated ??= loadEnv();
  return validated;
}

/**
 * Server-side environment, validated on first read rather than on import: the browser loads this
 * module through the `shared/config` barrel (for `clientEnv`) and must not validate the server
 * variables it never receives.
 */
export const env: Env = {
  get NODE_ENV() {
    return serverEnv().NODE_ENV;
  },
  get NEXT_PUBLIC_SITE_URL() {
    return serverEnv().NEXT_PUBLIC_SITE_URL;
  },
  get NEXT_PUBLIC_BASE_PATH() {
    return serverEnv().NEXT_PUBLIC_BASE_PATH;
  },
  get NEXT_PUBLIC_CALENDLY_URL() {
    return serverEnv().NEXT_PUBLIC_CALENDLY_URL;
  },
  get SANITY_PROJECT_ID() {
    return serverEnv().SANITY_PROJECT_ID;
  },
  get SANITY_DATASET() {
    return serverEnv().SANITY_DATASET;
  },
  get SANITY_API_VERSION() {
    return serverEnv().SANITY_API_VERSION;
  },
};
