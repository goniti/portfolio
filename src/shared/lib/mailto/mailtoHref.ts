/** Header fields a `mailto:` link may prefill. */
export interface MailtoFields {
  subject?: string;
  body?: string;
}

/**
 * A `mailto:` link opening a message to `email` in the visitor's mail app, prefilled with the
 * given fields. Spaces are encoded as `%20`: mail apps do not read `+` as a space.
 */
export function mailtoHref(email: string, fields: MailtoFields = {}): string {
  const params = new URLSearchParams();
  if (fields.subject) params.set('subject', fields.subject);
  if (fields.body) params.set('body', fields.body);
  const query = params.toString().replaceAll('+', '%20');
  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}
