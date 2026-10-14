import { z } from 'zod';

/** An empty variable (an unset GitHub Actions `vars.X` expands to "") counts as unset. */
export const unsetIfEmpty = (value: unknown) => (value === '' ? undefined : value);

/** A Calendly scheduling page: `https://calendly.com/<user>/<event>`. */
export const CALENDLY_PAGE_PATTERN = /^https:\/\/calendly\.com\/.+/;

/**
 * Sub-path the site is served from: empty at the domain root (`pnpm dev`), `/portfolio` on
 * the GitHub Pages project page. Starts with `/`, no trailing slash.
 */
const BasePathSchema = z
  .string()
  .regex(/^(\/[\w.~-]+)*$/, 'must be empty or look like "/portfolio" (no trailing slash)')
  .default('');

/** Optional: unset or empty hides the "Book a call" tab. */
const CalendlyUrlSchema = z.preprocess(
  unsetIfEmpty,
  z
    .url()
    .regex(
      CALENDLY_PAGE_PATTERN,
      'must be a Calendly page such as "https://calendly.com/<user>/<event>"',
    )
    .optional(),
);

/** Public variables, inlined into the browser bundle at build time (static export). */
export const ClientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_BASE_PATH: BasePathSchema,
  NEXT_PUBLIC_CALENDLY_URL: CalendlyUrlSchema,
});

type ClientEnv = z.output<typeof ClientEnvSchema>;

type EnvSource = Record<string, string | undefined>;

/** Parses an environment with its schema, or throws one error listing every invalid variable. */
export function parseEnv<Schema extends z.ZodType>(
  schema: Schema,
  source: EnvSource,
): z.output<Schema> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export function loadClientEnv(source: EnvSource): ClientEnv {
  return parseEnv(ClientEnvSchema, source);
}

let validated: ClientEnv | undefined;

/**
 * Each variable is read by its literal name: Next.js only inlines `process.env.NEXT_PUBLIC_X`
 * member accesses into the browser bundle.
 */
function publicEnv(): ClientEnv {
  validated ??= loadClientEnv({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    NEXT_PUBLIC_CALENDLY_URL: process.env.NEXT_PUBLIC_CALENDLY_URL,
  });
  return validated;
}

/**
 * Safe in client components. Validated on first read rather than on import, like `env`: a module
 * importing it (a story, a test) never touches `process.env` until a value is needed.
 */
export const clientEnv: ClientEnv = {
  get NEXT_PUBLIC_SITE_URL() {
    return publicEnv().NEXT_PUBLIC_SITE_URL;
  },
  get NEXT_PUBLIC_BASE_PATH() {
    return publicEnv().NEXT_PUBLIC_BASE_PATH;
  },
  get NEXT_PUBLIC_CALENDLY_URL() {
    return publicEnv().NEXT_PUBLIC_CALENDLY_URL;
  },
};
