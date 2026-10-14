import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from './locales';

/** One item of an internationalized array, as stored by the plugin (v5: `language` field). */
export interface LocalizedItem {
  _key?: string | null;
  language?: string | null;
  value?: unknown;
}

export interface LocaleRules {
  /** The value of each locale may be empty (the locale must still be present). */
  allowBlank?: boolean;
}

/** Why a localized field is not publishable; `itemKey` points at the item when there is one. */
export type LocaleProblem =
  | { kind: 'no-language'; itemKey: string | undefined }
  | { kind: 'unknown-language'; itemKey: string | undefined; language: string }
  | { kind: 'duplicate-locale'; itemKey: string | undefined; locale: Locale }
  | { kind: 'blank-value'; itemKey: string | undefined; locale: Locale }
  | { kind: 'missing-locale'; locale: Locale };

type MaybeItems = readonly LocalizedItem[] | null | undefined;

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || value.trim() === '';
}

/**
 * Every reason a localized field is invalid, in item order, then one `missing-locale` per absent
 * locale: an item without `language` (legacy v4 format), an unknown language, a locale set twice,
 * a blank value (unless `allowBlank`).
 */
export function findLocaleProblems(items: MaybeItems, rules: LocaleRules = {}): LocaleProblem[] {
  const problems: LocaleProblem[] = [];
  const seen = new Set<Locale>();

  for (const item of items ?? []) {
    const itemKey = item._key ?? undefined;
    const language = item.language;
    if (!language) {
      problems.push({ kind: 'no-language', itemKey });
    } else if (!isLocale(language)) {
      problems.push({ kind: 'unknown-language', itemKey, language });
    } else if (seen.has(language)) {
      problems.push({ kind: 'duplicate-locale', itemKey, locale: language });
    } else {
      seen.add(language);
      if (!rules.allowBlank && isBlank(item.value)) {
        problems.push({ kind: 'blank-value', itemKey, locale: language });
      }
    }
  }

  for (const locale of LOCALES) {
    if (!seen.has(locale)) problems.push({ kind: 'missing-locale', locale });
  }
  return problems;
}

/** Locales without a usable value (blank or absent), each once, in `LOCALES` order. */
export function missingLocales(items: MaybeItems, rules: LocaleRules = {}): Locale[] {
  const missing = new Set<Locale>();
  for (const problem of findLocaleProblems(items, rules)) {
    if (problem.kind === 'blank-value' || problem.kind === 'missing-locale') {
      missing.add(problem.locale);
    }
  }
  return LOCALES.filter((locale) => missing.has(locale));
}

function firstValueOf(items: MaybeItems, locale: Locale): unknown {
  return items?.find((item) => item.language === locale)?.value;
}

/** The string value of a locale (the default one when not given), if it has one. */
export function localizedValue(
  items: MaybeItems,
  locale: Locale = DEFAULT_LOCALE,
): string | undefined {
  const value = firstValueOf(items, locale);
  return typeof value === 'string' ? value : undefined;
}

/** The first non-blank value in locale order, to stand in for a gap in development. */
export function fallbackValue(items: MaybeItems): string | undefined {
  for (const locale of LOCALES) {
    const value = firstValueOf(items, locale);
    if (typeof value === 'string' && !isBlank(value)) return value;
  }
  return undefined;
}
