import { preferenceKey, readPreference, writePreference } from '../preferences';
import { DEFAULT_LOCALE, isLocale, type Locale } from './locale';

const LOCALE_PREFERENCE = 'lang';
const listeners = new Set<() => void>();

/** The visitor's locale: last choice stored in `localStorage`, the default otherwise. */
export function readLocale(): Locale {
  const stored = readPreference(LOCALE_PREFERENCE);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

/** Stores the locale and notifies every subscriber of this tab. */
export function writeLocale(locale: Locale): void {
  writePreference(LOCALE_PREFERENCE, locale);
  listeners.forEach((listener) => listener());
}

/** Listens to locale changes, from this tab and from the other ones (`storage` event). */
export function subscribeToLocale(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === preferenceKey(LOCALE_PREFERENCE)) onChange();
  };
  listeners.add(onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}
