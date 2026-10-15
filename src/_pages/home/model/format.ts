import { INTL_LOCALE, type Locale } from '@/shared/lib/i18n';
import type { PersonLocation } from './content';

/** Two-digit ordinal label ("00", "01"…) for numbered lists. */
export function formatIndex(index: number, offset = 0): string {
  return String(index + offset).padStart(2, '0');
}

/**
 * Locale of the month labels: `en-US` abbreviates September as "Sep" (`en-GB` says "Sept"), the
 * style the page has always used.
 */
const MONTH_LOCALE: Record<Locale, string> = { en: 'en-US', fr: 'fr-FR' };

const monthFormatters = new Map<Locale, Intl.DateTimeFormat>();

function monthFormatter(locale: Locale): Intl.DateTimeFormat {
  let formatter = monthFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(MONTH_LOCALE[locale], {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    monthFormatters.set(locale, formatter);
  }
  return formatter;
}

/** "Jul 2024" / "Juil. 2024" from an ISO date (`2024-07-01`): month and year only. */
export function formatMonthYear(isoDate: string, locale: Locale): string {
  const label = monthFormatter(locale).format(new Date(`${isoDate}T00:00:00Z`));
  return label.charAt(0).toLocaleUpperCase(MONTH_LOCALE[locale]) + label.slice(1);
}

/** "Jul 2024 — Present": an open period ends on the given label. */
export function formatPeriod(
  startDate: string,
  endDate: string | null,
  locale: Locale,
  presentLabel: string,
): string {
  const end = endDate ? formatMonthYear(endDate, locale) : presentLabel;
  return `${formatMonthYear(startDate, locale)} — ${end}`;
}

/** "Lyon, France · Remote": the place, its country named in the locale, and the remote mention. */
export function formatLocation(
  { locality, country, remote }: PersonLocation,
  locale: Locale,
  remoteLabel: string,
): string {
  const countryName = new Intl.DisplayNames(INTL_LOCALE[locale], { type: 'region' }).of(country);
  const place = `${locality}, ${countryName ?? country}`;
  return remote ? `${place} · ${remoteLabel}` : place;
}
