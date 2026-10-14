/** A `mailto:` link opening a blank message to `email` in the visitor's mail app. */
export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}
