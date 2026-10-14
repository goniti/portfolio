/**
 * Content languages. Mirrors `LOCALES` in `src/shared/lib/i18n` (ADR-003: a hard-coded constant,
 * not a `locale` document type). Drift between the two lists fails `pnpm content:check`.
 */
export const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'fr', title: 'Français' },
] as const;

/** "French (fr)", the way validation messages name a language. */
export function languageLabel(id: string): string {
  const language = LANGUAGES.find((candidate) => candidate.id === id);
  return language ? `${language.title} (${language.id})` : `"${id}"`;
}
