import type { CustomValidatorResult, Rule } from 'sanity';
import { findLocaleProblems, type LocaleRules, type LocalizedItem } from './localeProblems';

interface RequireLocalesOptions extends LocaleRules {
  /** The field may be left out entirely; once it has a value, every locale is required. */
  optional?: boolean;
}

/** Turns the locale problems into Studio validation errors (errors block Publish). */
export function validateLocales(
  value: LocalizedItem[] | undefined,
  options: RequireLocalesOptions = {},
): CustomValidatorResult {
  if (options.optional && (!value || value.length === 0)) return true;
  const problems = findLocaleProblems(value, options);
  if (problems.length === 0) return true;
  return problems.map(({ message, path }) => (path.length > 0 ? { message, path } : { message }));
}

/**
 * Validation of every localized field (ADR-003): one error per missing, blank, duplicate or
 * unknown locale, attached to the item when it exists, to the field otherwise.
 */
export function requireLocales(options: RequireLocalesOptions = {}) {
  return (rule: Rule) =>
    rule.custom<LocalizedItem[]>((value) => validateLocales(value, options)).error();
}
