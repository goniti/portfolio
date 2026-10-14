import { LANGUAGES, languageLabel } from '../locales';

/** One item of an internationalized array (plugin v5: the language has its own field). */
export interface LocalizedItem {
  _key?: string;
  language?: string | null;
  value?: unknown;
}

/** Path segment Sanity understands: a field name, or an array item by `_key`. */
type PathSegment = string | { _key: string };

export interface LocaleProblem {
  message: string;
  /** Relative to the field; empty when the problem concerns the whole field. */
  path: PathSegment[];
}

export interface LocaleRules {
  /** The value of each locale may be empty (the locale must still be present). */
  allowBlank?: boolean;
}

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || value.trim() === '';
}

function itemPath(item: LocalizedItem, ...rest: string[]): PathSegment[] {
  return item._key ? [{ _key: item._key }, ...rest] : [];
}

/**
 * Every reason a localized field is not publishable: a missing or blank locale, a duplicate or
 * unknown language, a legacy (v4) item without `language`. One problem per locale, so the
 * Studio shows each gap on its own.
 */
export function findLocaleProblems(
  items: readonly LocalizedItem[] | null | undefined,
  rules: LocaleRules = {},
): LocaleProblem[] {
  const problems: LocaleProblem[] = [];
  const seen = new Set<string>();

  for (const item of items ?? []) {
    const language = item.language;
    if (!language) {
      problems.push({
        message: 'Item without a language (legacy v4 format): remove it and add the language again',
        path: itemPath(item),
      });
      continue;
    }
    if (!LANGUAGES.some((candidate) => candidate.id === language)) {
      problems.push({
        message: `Unknown language ${languageLabel(language)}`,
        path: itemPath(item),
      });
      continue;
    }
    if (seen.has(language)) {
      problems.push({ message: `${languageLabel(language)} is set twice`, path: itemPath(item) });
      continue;
    }
    seen.add(language);
    if (!rules.allowBlank && isBlank(item.value)) {
      problems.push({
        message: `${languageLabel(language)} is empty`,
        path: itemPath(item, 'value'),
      });
    }
  }

  for (const { id } of LANGUAGES) {
    if (!seen.has(id)) {
      problems.push({ message: `${languageLabel(id)} translation is required`, path: [] });
    }
  }
  return problems;
}

/** Languages without a usable value, for the "Missing: fr" preview subtitles. */
export function missingLanguages(
  items: readonly LocalizedItem[] | null | undefined,
  rules: LocaleRules = {},
): string[] {
  return LANGUAGES.filter(({ id }) => {
    const item = items?.find((candidate) => candidate.language === id);
    return !item || (!rules.allowBlank && isBlank(item.value));
  }).map(({ id }) => id);
}

export function localizedValue(
  items: readonly LocalizedItem[] | null | undefined,
  language: string = LANGUAGES[0].id,
): string | undefined {
  const value = items?.find((item) => item.language === language)?.value;
  return typeof value === 'string' ? value : undefined;
}
