'use client';

import * as SegmentedControl from 'goniui/segmented-control';
import { Button } from 'goniui';
import { tv } from 'tailwind-variants';
import { LOCALES, useLocale, useMessages } from '@/shared/lib/i18n';
import { navControlVariants } from './ThemeToggle';
import { siteNavMessages } from './messages';

const languageOptionVariants = tv({
  base: 'h-7 flex-none rounded-full px-2.5 py-0 font-mono text-2xs font-medium',
  variants: {
    active: {
      true: 'bg-surface-inverse text-foreground-inverse',
      false: 'bg-transparent text-foreground-muted',
    },
  },
});

/** EN / FR segments for the wide navigation bar. */
export function LanguageSegments() {
  const copy = useMessages(siteNavMessages);
  const { locale, setLocale } = useLocale();

  return (
    <SegmentedControl.Root
      aria-label={copy.languageLabel}
      className="w-auto flex-none gap-0 rounded-full border-border bg-chip p-0.75"
    >
      {LOCALES.map((option) => (
        <SegmentedControl.Item
          key={option}
          active={option === locale}
          aria-pressed={option === locale}
          aria-label={copy.languageNames[option]}
          onClick={() => setLocale(option)}
          className={languageOptionVariants({ active: option === locale })}
        >
          {copy.languages[option]}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}

/** One button cycling between languages, for the compact navigation bar. */
export function LanguageToggle() {
  const copy = useMessages(siteNavMessages);
  const { locale, setLocale } = useLocale();
  const next = LOCALES.find((option) => option !== locale) ?? locale;

  return (
    <Button
      variant="unstyled"
      size="none"
      aria-label={`${copy.languageLabel}: ${copy.languageNames[next]}`}
      onClick={() => setLocale(next)}
      className={navControlVariants({ size: 'lg', className: 'font-mono text-2xs font-medium' })}
    >
      {copy.languages[locale]}
    </Button>
  );
}
