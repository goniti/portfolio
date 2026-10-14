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

/**
 * Resume PDF, shipped from `public/`, root-relative: prefix it with `withBasePath` where it is
 * rendered. An empty string hides the download links.
 */
export const RESUME_PATH: string = '/resume.pdf';
