import type { Localized } from '@/shared/lib/i18n';

// The title, the lead and the channel values (email, LinkedIn, GitHub) are content (Sanity).
const en = {
  eyebrow: '05 — Contact',
  channelsLabel: 'Direct contact',
  channels: {
    email: {
      label: 'EMAIL',
      copy: 'Copy email',
      copied: 'Copied!',
      copyFailed: 'Copy failed, select the address instead',
    },
    linkedin: { label: 'LINKEDIN' },
    github: { label: 'GITHUB' },
  },
  external: '↗',
  newTab: '(opens in a new tab)',
  tabs: {
    call: 'Book a call',
    message: 'Send a message',
  },
  calendlyTitle: 'Book a 30-min intro call',
  calendlyLoading: 'Loading the booking calendar…',
  form: {
    name: 'Name',
    namePlaceholder: 'Jane Doe',
    email: 'Email',
    emailPlaceholder: 'jane@company.com',
    message: 'Message',
    messagePlaceholder: 'Tell me about the role or project…',
    send: 'Send message →',
    subject: (name: string) => `Portfolio contact — ${name}`,
    errors: {
      nameTooShort: 'min. 2 characters',
      invalidEmail: 'enter a valid email',
      messageTooShort: (missing: number) => `${missing} more characters`,
    },
  },
  sent: {
    glyph: '✓',
    title: 'Your email is ready.',
    message: (name: string, email: string) =>
      `Thanks ${name} — your mail app opened with the message. Hit send and I’ll reply to ${email} within 48 hours.`,
    another: 'Send another',
  },
};

export const contactMessages: Localized<typeof en> = {
  en,
  fr: {
    ...en,
    channelsLabel: 'Contact direct',
    channels: {
      ...en.channels,
      email: {
        ...en.channels.email,
        copy: 'Copier l’email',
        copied: 'Copié !',
        copyFailed: 'Échec de la copie, sélectionnez l’adresse',
      },
    },
    newTab: '(nouvel onglet)',
    tabs: {
      call: 'Réserver un appel',
      message: 'Envoyer un message',
    },
    calendlyTitle: 'Réserver un appel de 30 min',
    calendlyLoading: 'Chargement du calendrier…',
    form: {
      ...en.form,
      name: 'Nom',
      messagePlaceholder: 'Parlez-moi du poste ou du projet…',
      send: 'Envoyer →',
      subject: (name: string) => `Contact portfolio — ${name}`,
      errors: {
        nameTooShort: '2 caractères min.',
        invalidEmail: 'email invalide',
        messageTooShort: (missing: number) => `encore ${missing} caractères`,
      },
    },
    sent: {
      ...en.sent,
      title: 'Votre email est prêt.',
      message: (name: string, email: string) =>
        `Merci ${name} — votre messagerie s’est ouverte avec le message. Envoyez-le et je réponds à ${email} sous 48 h.`,
      another: 'Envoyer un autre',
    },
  },
};
