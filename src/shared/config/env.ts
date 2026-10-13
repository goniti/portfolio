import { z } from 'zod';

// Server-side variables only: client code reads `process.env.NEXT_PUBLIC_*` directly.
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
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
