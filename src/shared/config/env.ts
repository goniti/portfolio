import { z } from 'zod';
import { ClientEnvSchema, parseEnv, unsetIfEmpty } from './clientEnv';

/** Sanity API version, pinned (never `latest`): a date such as `2026-10-01`. */
const ApiVersionSchema = /* @__PURE__ */ z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a pinned date such as "2026-10-01"')
  .default('2026-10-01');

/** Why the content cannot be fetched without a Sanity project ID, and how to fix it. */
export const SANITY_PROJECT_ID_REQUIRED =
  'SANITY_PROJECT_ID is required to fetch the content: copy .env.example to .env.local';

// Server-side: the public variables plus the build-time ones. Client code imports `clientEnv`;
// `@__PURE__` lets the production build drop these schemas from the browser bundle.
const EnvSchema = /* @__PURE__ */ ClientEnvSchema.extend({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
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
}).superRefine((value, context) => {
  // `pnpm dev` and `pnpm build` fetch the content; unit tests and Storybook never do.
  if (value.NODE_ENV === 'test' || value.SANITY_PROJECT_ID) return;
  context.addIssue({
    code: 'custom',
    path: ['SANITY_PROJECT_ID'],
    message: SANITY_PROJECT_ID_REQUIRED,
  });
});

type Env = z.output<typeof EnvSchema>;

/**
 * Validates the environment once: `next.config.ts` calls it, so `next dev` and
 * `next build` stop immediately on an invalid or missing variable.
 */
export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  return parseEnv(EnvSchema, source);
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
