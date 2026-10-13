/** Prefix of every key the site writes to `localStorage`. */
const PREFERENCE_PREFIX = 'pf-';

/** Reads a stored preference; `null` when absent or when storage is unavailable (private mode). */
export function readPreference(name: string): string | null {
  try {
    return window.localStorage.getItem(`${PREFERENCE_PREFIX}${name}`);
  } catch {
    return null;
  }
}

/** Stores a preference; silently ignored when storage is unavailable. */
export function writePreference(name: string, value: string): void {
  try {
    window.localStorage.setItem(`${PREFERENCE_PREFIX}${name}`, value);
  } catch {
    // Storage blocked: the preference only lasts for the session.
  }
}

/** The storage key of a preference, to match `storage` events from other tabs. */
export function preferenceKey(name: string): string {
  return `${PREFERENCE_PREFIX}${name}`;
}
