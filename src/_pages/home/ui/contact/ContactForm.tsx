import * as Form from 'goniui/form';
import { Text } from 'goniui';
import { useMessages } from '@/shared/lib/i18n';
import { CtaButton, Surface } from '@/shared/ui/atoms';
import { useContactForm } from '../../model/useContactForm';
import { contactMessages } from './messages';

export interface ContactFormProps {
  recipient: string;
  /** Opens the composed email; defaults to the visitor's mail app. */
  openMailto?: (href: string) => void;
}

/** Message form; on submit it opens the visitor's mail app with the message ready to send. */
export function ContactForm({ recipient, openMailto }: ContactFormProps) {
  const copy = useMessages(contactMessages);
  const { methods, submit, sender, startOver } = useContactForm({
    recipient,
    validationCopy: copy.form.errors,
    subject: copy.form.subject,
    openMailto,
  });

  if (sender) {
    return (
      <Surface
        fill="form"
        aria-live="polite"
        className="flex min-h-90 flex-col items-start justify-center gap-3.5 border-tint-emerald/35 p-7"
      >
        <Text
          as="span"
          variant="h2"
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-2xl bg-tint-emerald/15 font-mono font-semibold text-success text-xl"
        >
          {copy.sent.glyph}
        </Text>
        <Text as="h3" variant="h2" className="font-bold text-2xl tracking-tight">
          {copy.sent.title}
        </Text>
        <Text variant="bodyLg" tone="muted" className="leading-relaxed">
          {copy.sent.message(sender.name, sender.email)}
        </Text>
        <CtaButton tone="quiet" size="md" onClick={startOver} className="mt-1.5 rounded-lg">
          {copy.sent.another}
        </CtaButton>
      </Surface>
    );
  }

  return (
    <Form.Root
      methods={methods}
      onSubmit={submit}
      className="rounded-3xl border border-border bg-surface-form p-5 backdrop-blur-lg md:p-7"
    >
      <Form.Input
        label={copy.form.name}
        placeholder={copy.form.namePlaceholder}
        autoComplete="name"
        {...methods.register('name')}
      />
      <Form.Email
        label={copy.form.email}
        placeholder={copy.form.emailPlaceholder}
        {...methods.register('email')}
      />
      <Form.Textarea
        {...methods.register('message')}
        label={copy.form.message}
        placeholder={copy.form.messagePlaceholder}
        rows={5}
      />
      <CtaButton type="submit" block>
        {copy.form.send}
      </CtaButton>
    </Form.Root>
  );
}
