import type { FieldErrors, Resolver } from 'react-hook-form';
import { CALENDLY_PAGE_PATTERN } from '@/shared/config';
import { mailtoHref } from '@/shared/lib/mailto';

const NAME_MIN_LENGTH = 2;
const MESSAGE_MIN_LENGTH = 10;

export interface ContactValidationCopy {
  nameTooShort: string;
  invalidEmail: string;
  /** Message shown while the text is too short, with the number of characters still needed. */
  messageTooShort: (missingCharacters: number) => string;
}

export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

const CONTACT_FIELDS = ['name', 'email', 'message'] as const;

/** The error message of each invalid field; a valid field has none. */
type ContactProblems = Partial<Record<keyof ContactValues, string>>;

/** Same rule as zod's `z.email()`, which validates the content at build time. */
const EMAIL_PATTERN =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

/** The values as sent: every field trimmed. */
function trimContact(values: ContactValues): ContactValues {
  return { name: values.name.trim(), email: values.email.trim(), message: values.message.trim() };
}

/** Checks trimmed values; error messages come from the locale's copy. */
export function validateContact(
  values: ContactValues,
  copy: ContactValidationCopy,
): ContactProblems {
  const problems: ContactProblems = {};
  if (values.name.length < NAME_MIN_LENGTH) problems.name = copy.nameTooShort;
  if (!EMAIL_PATTERN.test(values.email)) problems.email = copy.invalidEmail;
  if (values.message.length < MESSAGE_MIN_LENGTH) {
    problems.message = copy.messageTooShort(MESSAGE_MIN_LENGTH - values.message.length);
  }
  return problems;
}

/**
 * The form's react-hook-form resolver: trims, then validates. Hand-written rather than zod, which
 * stays on the server so the browser bundle does not ship it.
 */
export function createContactResolver(copy: ContactValidationCopy): Resolver<ContactValues> {
  return (values) => {
    const trimmed = trimContact(values);
    const problems = validateContact(trimmed, copy);
    const errors: FieldErrors<ContactValues> = {};
    for (const field of CONTACT_FIELDS) {
      const message = problems[field];
      if (message) errors[field] = { type: 'validate', message };
    }
    return Object.keys(errors).length === 0
      ? { values: trimmed, errors: {} }
      : { values: {}, errors };
  };
}

export const EMPTY_CONTACT: ContactValues = { name: '', email: '', message: '' };

/** A `mailto:` link carrying the message, opened in the visitor's mail app. */
export function buildContactMailto(
  recipient: string,
  subject: string,
  values: ContactValues,
): string {
  const body = `${values.message}\n\n— ${values.name} <${values.email}>`;
  return mailtoHref(recipient, { subject, body });
}

/** Calendly inline-embed URL themed for the page, or `null` when the page URL is missing or invalid. */
export function calendlyEmbedUrl(pageUrl: string, theme: 'light' | 'dark'): string | null {
  const trimmed = pageUrl.trim();
  if (!CALENDLY_PAGE_PATTERN.test(trimmed)) return null;
  const url = new URL(trimmed);
  url.searchParams.set('embed_type', 'Inline');
  url.searchParams.set('hide_gdpr_banner', '1');
  url.searchParams.set('background_color', theme === 'dark' ? '0d0f17' : 'ffffff');
  url.searchParams.set('text_color', theme === 'dark' ? 'e6e8ef' : '0f1222');
  url.searchParams.set('primary_color', '818cf8');
  return url.toString();
}
