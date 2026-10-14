import { isLocale, LOCALES, type Locale } from 'portfolio-content-model';

const LOCALE_TITLES = { en: 'English', fr: 'Français' } satisfies Record<Locale, string>;

/** The content locales as the internationalized-array plugin lists them (`id`, `title`). */
export const LOCALE_OPTIONS = LOCALES.map((id) => ({ id, title: LOCALE_TITLES[id] }));

/** "Français (fr)", the way validation messages name a locale; an unknown code is quoted. */
export function localeLabel(code: string): string {
  return isLocale(code) ? `${LOCALE_TITLES[code]} (${code})` : `"${code}"`;
}
