import { z } from 'zod';
import { isLocale, LOCALES, type Locale, type Localized } from '../../lib/i18n';

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

interface LocalizedOptions {
  /** The value may be empty (each locale must still be present). */
  allowBlank?: boolean;
}

function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim() === '';
}

interface LocaleProblem {
  message: string;
  params: LocaleIssueParams;
}

/** Every locale problem of a field; `fallback` is filled once all items are known. */
function findProblems(items: readonly LocalizedItem[], options: LocalizedOptions): LocaleProblem[] {
  const problems: LocaleProblem[] = [];
  const values = new Map<Locale, string>();
  const gaps: Locale[] = [];

  for (const item of items) {
    if (!item.language) {
      problems.push({
        message: 'item without a language (legacy v4 format)',
        params: { localeIssue: true },
      });
    } else if (!isLocale(item.language)) {
      problems.push({
        message: `unknown language "${item.language}"`,
        params: { localeIssue: true },
      });
    } else if (values.has(item.language) || gaps.includes(item.language)) {
      problems.push({
        message: 'language set twice',
        params: { localeIssue: true, locale: item.language },
      });
    } else if (!options.allowBlank && isBlank(item.value)) {
      gaps.push(item.language);
      problems.push({
        message: 'empty translation',
        params: { localeIssue: true, locale: item.language },
      });
    } else {
      values.set(item.language, item.value ?? '');
    }
  }

  for (const locale of LOCALES) {
    if (values.has(locale) || gaps.includes(locale)) continue;
    gaps.push(locale);
    problems.push({ message: 'missing translation', params: { localeIssue: true, locale } });
  }

  const fallback = LOCALES.map((locale) => values.get(locale)).find((value) => !isBlank(value));
  return problems.map((problem) =>
    problem.params.locale && gaps.includes(problem.params.locale) && fallback !== undefined
      ? { ...problem, params: { ...problem.params, fallback } }
      : problem,
  );
}

function toLocalized(items: readonly LocalizedItem[]): Localized<string> {
  const byLocale = new Map(items.map((item) => [item.language, item.value ?? '']));
  const valueOf = (locale: Locale): string => byLocale.get(locale) ?? '';
  return { en: valueOf('en'), fr: valueOf('fr') };
}

const ItemsSchema = z.array(LocalizedItemSchema).nullish();

function reportProblems(
  items: readonly LocalizedItem[],
  context: z.RefinementCtx,
  options: LocalizedOptions,
): void {
  for (const { message, params } of findProblems(items, options)) {
    context.addIssue({ code: 'custom', message, params });
  }
}

/**
 * An internationalized array (`[{language, value}]`) as `Record<Locale, string>`. Adds one issue
 * per missing, blank, duplicate or unknown locale, so a gap never reaches the page silently
 * (ADR-003). Queries return the raw array: never `coalesce` across locales.
 */
export function localizedString(options: LocalizedOptions = {}) {
  return ItemsSchema.transform((items) => items ?? [])
    .superRefine((items, context) => reportProblems(items, context, options))
    .transform(toLocalized);
}

/** A localized field that may be left out (`null`); once set, every locale is required. */
export function optionalLocalizedString(options: LocalizedOptions = {}) {
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
