import { z } from 'zod';

const NAME_MIN_LENGTH = 2;
const MESSAGE_MIN_LENGTH = 10;

export interface ContactValidationCopy {
  nameTooShort: string;
  invalidEmail: string;
  /** Message shown while the text is too short, with the number of characters still needed. */
  messageTooShort: (missingCharacters: number) => string;
}

/** Contact form schema; error messages come from the locale's copy. */
export function createContactSchema(copy: ContactValidationCopy) {
  return z.object({
    name: z.string().trim().min(NAME_MIN_LENGTH, copy.nameTooShort),
    email: z.string().trim().pipe(z.email(copy.invalidEmail)),
    message: z
      .string()
      .trim()
      .superRefine((value, context) => {
        if (value.length >= MESSAGE_MIN_LENGTH) return;
        context.addIssue({
          code: 'custom',
          message: copy.messageTooShort(MESSAGE_MIN_LENGTH - value.length),
        });
      }),
  });
}

export type ContactValues = z.infer<ReturnType<typeof createContactSchema>>;

export const EMPTY_CONTACT: ContactValues = { name: '', email: '', message: '' };

/** A `mailto:` link carrying the message, opened in the visitor's mail app. */
export function buildContactMailto(
  recipient: string,
  subject: string,
  values: ContactValues,
): string {
  const body = `${values.message}\n\n— ${values.name} <${values.email}>`;
  const query = new URLSearchParams({ subject, body }).toString().replaceAll('+', '%20');
  return `mailto:${recipient}?${query}`;
}

const CALENDLY_PAGE = /^https:\/\/calendly\.com\/.+/;

/** Calendly inline-embed URL themed for the page, or `null` when the page URL is missing or invalid. */
export function calendlyEmbedUrl(pageUrl: string, theme: 'light' | 'dark'): string | null {
  const trimmed = pageUrl.trim();
  if (!CALENDLY_PAGE.test(trimmed)) return null;
  const url = new URL(trimmed);
  url.searchParams.set('embed_type', 'Inline');
  url.searchParams.set('hide_gdpr_banner', '1');
  url.searchParams.set('background_color', theme === 'dark' ? '0d0f17' : 'ffffff');
  url.searchParams.set('text_color', theme === 'dark' ? 'e6e8ef' : '0f1222');
  url.searchParams.set('primary_color', '818cf8');
  return url.toString();
}
