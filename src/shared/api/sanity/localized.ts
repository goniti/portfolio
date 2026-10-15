import {
  fallbackValue,
  findLocaleProblems,
  isLocale,
  type Locale,
  type LocaleProblem,
  type LocaleRules,
  type Localized,
} from 'portfolio-content-model';
import { z } from 'zod';

/** One item of an internationalized array, as stored by the plugin (v5: `language` field). */
const LocalizedItemSchema = z.object({
  _key: z.string().nullish(),
  language: z.string().nullish(),
  value: z.string().nullish(),
});

type LocalizedItem = z.infer<typeof LocalizedItemSchema>;

/** Extra data of a locale issue: the report names the locale, the dev fallback uses `fallback`. */
export interface LocaleIssueParams {
  localeIssue: true;
  locale?: Locale;
  /** Value of another locale, set when the gap can be filled in development. */
  fallback?: string;
}

/** How the build report names a locale problem (developer-facing). */
function siteMessage(problem: LocaleProblem): string {
  switch (problem.kind) {
    case 'no-language':
      return 'item without a language (legacy v4 format)';
    case 'unknown-language':
      return `unknown language "${problem.language}"`;
    case 'duplicate-locale':
      return 'language set twice';
    case 'blank-value':
      return 'empty translation';
    case 'missing-locale':
      return 'missing translation';
  }
}

/** The locale of a problem, and the value that can fill its gap in development. */
function issueParams(problem: LocaleProblem, fallback: string | undefined): LocaleIssueParams {
  switch (problem.kind) {
    case 'no-language':
    case 'unknown-language':
      return { localeIssue: true };
    case 'duplicate-locale':
      return { localeIssue: true, locale: problem.locale };
    case 'blank-value':
    case 'missing-locale':
      return fallback === undefined
        ? { localeIssue: true, locale: problem.locale }
        : { localeIssue: true, locale: problem.locale, fallback };
  }
}

function toLocalized(items: readonly LocalizedItem[]): Localized<string> {
  const byLocale = new Map(items.map((item) => [item.language, item.value ?? '']));
  const textIn = (locale: Locale): string => byLocale.get(locale) ?? '';
  return { en: textIn('en'), fr: textIn('fr') };
}

const ItemsSchema = z.array(LocalizedItemSchema).nullish();

function reportProblems(
  items: readonly LocalizedItem[],
  context: z.RefinementCtx,
  options: LocaleRules,
): void {
  const fallback = fallbackValue(items);
  for (const problem of findLocaleProblems(items, options)) {
    context.addIssue({
      code: 'custom',
      message: siteMessage(problem),
      params: issueParams(problem, fallback),
    });
  }
}

/**
 * An internationalized array (`[{language, value}]`) as `Record<Locale, string>`. Adds one issue
 * per missing, blank, duplicate or unknown locale, so a gap never reaches the page silently
 * (ADR-003). Queries return the raw array: never `coalesce` across locales.
 */
export function localizedString(options: LocaleRules = {}) {
  return ItemsSchema.transform((items) => items ?? [])
    .superRefine((items, context) => reportProblems(items, context, options))
    .transform(toLocalized);
}

/** A localized field that may be left out (`null`); once set, every locale is required. */
export function optionalLocalizedString(options: LocaleRules = {}) {
  return ItemsSchema.transform((items) => (items && items.length > 0 ? items : null))
    .superRefine((items, context) => {
      if (items) reportProblems(items, context, options);
    })
    .transform((items) => (items ? toLocalized(items) : null));
}

function isLocaleIssueParams(params: unknown): params is LocaleIssueParams {
  if (typeof params !== 'object' || params === null) return false;
  if (!('localeIssue' in params) || params.localeIssue !== true) return false;
  if ('locale' in params && params.locale !== undefined && !isLocale(params.locale)) return false;
  return (
    !('fallback' in params) || params.fallback === undefined || typeof params.fallback === 'string'
  );
}

export function localeIssueParams(issue: z.core.$ZodIssue): LocaleIssueParams | undefined {
  if (issue.code !== 'custom') return undefined;
  return isLocaleIssueParams(issue.params) ? issue.params : undefined;
}
