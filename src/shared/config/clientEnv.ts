/** A Calendly scheduling page: `https://calendly.com/<user>/<event>`. */
export const CALENDLY_PAGE_PATTERN = /^https:\/\/calendly\.com\/.+/;

/** Site URL when `NEXT_PUBLIC_SITE_URL` is unset (`pnpm dev`). */
export const DEFAULT_SITE_URL = 'http://localhost:3000';

export interface ClientEnv {
  NEXT_PUBLIC_SITE_URL: string;
  /**
   * Sub-path the site is served from: empty at the domain root (`pnpm dev`), `/portfolio` on the
   * GitHub Pages project page. Starts with `/`, no trailing slash.
   */
  NEXT_PUBLIC_BASE_PATH: string;
  /** Optional: unset or empty hides the "Book a call" tab. */
  NEXT_PUBLIC_CALENDLY_URL: string | undefined;
}

/**
 * Public variables, inlined into the browser bundle at build time (static export). Safe in client
 * components. `loadEnv` (`env.ts`) validates them when `next.config.ts` loads, so `next dev` and
 * `next build` stop on an invalid value; this module only reads them and keeps zod out of the
 * browser bundle.
 *
 * Each variable is read by its literal name on access: Next.js only inlines
 * `process.env.NEXT_PUBLIC_X` member accesses, and a module importing this one (a story, a test)
 * never touches `process.env` until a value is needed.
 */
export const clientEnv: ClientEnv = {
  get NEXT_PUBLIC_SITE_URL() {
    return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  },
  get NEXT_PUBLIC_BASE_PATH() {
    return process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  },
  get NEXT_PUBLIC_CALENDLY_URL() {
    // An empty variable (an unset GitHub Actions `vars.X` expands to "") counts as unset.
    return process.env.NEXT_PUBLIC_CALENDLY_URL || undefined;
  },
};
