'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { readPreference, writePreference } from '../preferences';

export type Theme = 'light' | 'dark';

const THEME_PREFERENCE = 'theme';
const DARK_CLASS = 'dark';

function readTheme(): Theme {
  return document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light';
}

/** Applies a theme: goniui and the app tokens switch on the `.dark` class of `<html>`. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');
}

// The `<html>` class is the single source of truth: every consumer observes it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

/** The server renders the default dark theme (`<html class="dark">`). */
const getServerSnapshot = (): Theme => 'dark';

export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

/** Current colour theme, restored from the visitor's last choice. */
export function useTheme(): ThemeState {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  useEffect(() => {
    const stored = readPreference(THEME_PREFERENCE);
    if (stored === 'light' || stored === 'dark') applyTheme(stored);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    writePreference(THEME_PREFERENCE, next);
  }, []);

  return { theme, toggleTheme };
}
