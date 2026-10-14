import {
  missingLocales,
  type LocaleRules,
  type Locale,
  type LocalizedItem,
} from 'portfolio-content-model';

type MaybeLocalized = readonly LocalizedItem[] | null | undefined;

/** A localized field whose validation is not the default `requireLocales()`. */
interface LocalizedPreviewField extends LocaleRules {
  items: MaybeLocalized;
  /** Mirrors `requireLocales({ optional: true })`: absent is fine, once set every locale counts. */
  optional?: boolean;
}

type PreviewField = MaybeLocalized | LocalizedPreviewField;

/** An object of an array (achievements, takeaways…) as a preview selects it whole. */
type PreviewObject = Readonly<Record<string, MaybeLocalized>>;

function isFieldWithRules(field: PreviewField): field is LocalizedPreviewField {
  return field !== null && field !== undefined && !Array.isArray(field);
}

function missingIn(field: PreviewField): Locale[] {
  if (!isFieldWithRules(field)) return missingLocales(field);
  if (field.optional && !field.items?.length) return [];
  return missingLocales(field.items, field);
}

/**
 * "Missing: fr" when one of the given localized fields lacks a locale, so gaps show in
 * document lists without opening each document.
 */
export function missingLocalesSubtitle(fields: readonly PreviewField[]): string | undefined {
  const missing = new Set(fields.flatMap(missingIn));
  return missing.size > 0 ? `Missing: ${[...missing].join(', ')}` : undefined;
}

/**
 * The localized fields `names` of every object of an array, for `missingLocalesSubtitle`: a
 * preview can only select the array whole (`achievements: 'achievements'`).
 */
export function localizedFieldsOf(
  objects: readonly PreviewObject[] | null | undefined,
  ...names: string[]
): MaybeLocalized[] {
  return (objects ?? []).flatMap((object) => names.map((name) => object[name]));
}

export function joinSubtitle(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' · ');
}
