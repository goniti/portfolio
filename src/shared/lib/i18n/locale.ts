import type { Locale } from 'portfolio-content-model';

export { DEFAULT_LOCALE, isLocale, LOCALES } from 'portfolio-content-model';
export type { Locale, Localized } from 'portfolio-content-model';

/** BCP 47 tag used by `Intl` formatters for a locale. */
export const INTL_LOCALE: Record<Locale, string> = { en: 'en-GB', fr: 'fr-FR' };
