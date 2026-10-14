/** Content locales (ADR-003: a hard-coded constant, not a `locale` document type). */
export const LOCALES = ['en', 'fr'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** One value in every content locale; each locale has the same shape. */
export type Localized<Messages> = Record<Locale, Messages>;

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value);
}
