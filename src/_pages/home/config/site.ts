import { clientEnv } from '@/shared/config';
import { withBasePath } from '@/shared/lib/base-path';

/**
 * Fixed configuration of the portfolio page. The owner's identity, links and availability are
 * content, edited in Sanity (`siteSettings`, ADR-003).
 */

/** Delay between two typed characters in the hero terminal. */
export const TYPE_SPEED_MS = 55;

/**
 * Scroll depth (in viewport heights) past which the visitor has left the hero: the back-to-top
 * button appears and the Calendly scheduler starts loading, at the same moment.
 */
export const PAST_HERO_VIEWPORTS = 0.9;

/** Time zone of the hero clock (Lyon). */
export const CLOCK_TIME_ZONE = 'Europe/Paris';

/** Resume PDF, shipped from `public/`. An empty string hides the download links. */
export const RESUME_URL = withBasePath('/resume.pdf');

/**
 * Calendly scheduling page (`https://calendly.com/<user>/<event>`), from `NEXT_PUBLIC_CALENDLY_URL`
 * read at build time. `undefined` (variable unset or empty) hides the "Book a call" tab.
 */
export const CALENDLY_URL: string | undefined = clientEnv.NEXT_PUBLIC_CALENDLY_URL;
