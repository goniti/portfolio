'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { DEFAULT_LOCALE, type Locale, type Localized } from './locale';
import { readLocale, subscribeToLocale, writeLocale } from './localeStore';

/** The server renders the default locale; the stored choice applies once hydrated. */
const getServerLocale = (): Locale => DEFAULT_LOCALE;

export interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/** The current locale (persisted, shared by every component and tab) and its setter. */
export function useLocale(): LocaleState {
  const locale = useSyncExternalStore(subscribeToLocale, readLocale, getServerLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return { locale, setLocale: writeLocale };
}

/** The copy of a block in the current locale. */
export function useMessages<Messages>(messages: Localized<Messages>): Messages {
  const { locale } = useLocale();
  return messages[locale];
}

/** Picks the current locale's value of a localized content field. */
export function useLocalized(): <Value>(value: Localized<Value>) => Value {
  const { locale } = useLocale();
  return useCallback((value) => value[locale], [locale]);
}
