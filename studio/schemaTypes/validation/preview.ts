import { missingLanguages, type LocaleRules, type LocalizedItem } from './localeProblems';

type MaybeLocalized = readonly LocalizedItem[] | null | undefined;

/**
 * "Missing: fr" when one of the given localized fields lacks a language, so gaps show in
 * document lists without opening each document.
 */
export function missingLocalesSubtitle(
  fields: readonly MaybeLocalized[],
  rules: LocaleRules = {},
): string | undefined {
  const missing = new Set(fields.flatMap((field) => missingLanguages(field, rules)));
  return missing.size > 0 ? `Missing: ${[...missing].join(', ')}` : undefined;
}

export function joinSubtitle(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' · ');
}
