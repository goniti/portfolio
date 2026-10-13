/** Fixed configuration of the portfolio page (the mockup's tweakable props, frozen). */

/** Shows the "Open to work" state (badge, footer status). */
export const OPEN_TO_WORK = true;

/** Delay between two typed characters in the hero terminal. */
export const TYPE_SPEED_MS = 55;

/** Time zone of the hero clock (Lyon). */
export const CLOCK_TIME_ZONE = 'Europe/Paris';

export const CONTACT_EMAIL = 'gonzalezlovullocarlos@gmail.com';

/**
 * Outbound links. An empty string hides the link everywhere it appears:
 * set `linkedin` and `resume` once the profile URL and the PDF are available.
 */
export const SITE_LINKS = {
  github: 'https://github.com/goniti',
  linkedin: 'https://www.linkedin.com/in/carlos-gonzalez-lo-vullo',
  resume: '/resume.pdf',
  email: `mailto:${CONTACT_EMAIL}`,
} as const;

/**
 * Calendly scheduling page (`https://calendly.com/<user>/<event>`), from
 * `NEXT_PUBLIC_CALENDLY_URL`. Empty: the "Book a call" tab is hidden.
 */
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? '';
