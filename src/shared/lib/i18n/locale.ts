export const LOCALES = ['en', 'fr'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Copy of one block in every supported locale; each locale has the same shape. */
export type Localized<Messages> = Record<Locale, Messages>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** BCP 47 tag used by `Intl` formatters for a locale. */
export const INTL_LOCALE: Record<Locale, string> = { en: 'en-GB', fr: 'fr-FR' };
