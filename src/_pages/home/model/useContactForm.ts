'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  buildContactMailto,
  createContactResolver,
  EMPTY_CONTACT,
  type ContactValidationCopy,
  type ContactValues,
} from './contact';

export interface UseContactFormOptions {
  recipient: string;
  validationCopy: ContactValidationCopy;
  /** Subject of the email, built from the sender's name. */
  subject: (name: string) => string;
  /** Opens the composed `mailto:` link (the visitor's mail app). */
  openMailto?: (href: string) => void;
}

const openInMailApp = (href: string) => window.location.assign(href);

/**
 * Contact form state: validation (on blur then on change), submission through the
 * visitor's mail app, and the "sent" confirmation with the sender's details.
 */
export function useContactForm({
  recipient,
  validationCopy,
  subject,
  openMailto = openInMailApp,
}: UseContactFormOptions) {
  const resolver = useMemo(() => createContactResolver(validationCopy), [validationCopy]);
  const methods = useForm<ContactValues>({
    resolver,
    mode: 'onTouched',
    defaultValues: EMPTY_CONTACT,
  });
  const [sender, setSender] = useState<ContactValues | null>(null);

  const submit = (values: ContactValues) => {
    openMailto(buildContactMailto(recipient, subject(values.name), values));
    setSender(values);
  };

  const startOver = () => {
    methods.reset(EMPTY_CONTACT);
    setSender(null);
  };

  return { methods, submit, sender, startOver };
}
