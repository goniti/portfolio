import type { Localized } from '@/shared/lib/i18n';

const en = {
  eyebrow: '05 — Contact',
  title: 'Let’s build the next one together.',
  lead: 'Hiring a tech lead or senior front-end engineer? Send a message or reach out directly.',
  channelsLabel: 'Direct contact',
  channels: {
    email: { label: 'EMAIL' },
    linkedin: { label: 'LINKEDIN', value: 'Carlos Gonzalez Lo Vullo' },
    github: { label: 'GITHUB', value: 'goniti' },
  },
  external: '↗',
  newTab: '(opens in a new tab)',
  tabs: {
    message: { number: '01', label: 'Send a message' },
    call: { number: '02', label: 'Book a call' },
  },
  calendlyTitle: 'Book a 30-min intro call',
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
    title: 'Construisons le prochain ensemble.',
    lead: 'Vous recrutez un tech lead ou un développeur front-end senior ? Écrivez-moi ou contactez-moi directement.',
    channelsLabel: 'Contact direct',
    newTab: '(nouvel onglet)',
    tabs: {
      message: { number: '01', label: 'Envoyer un message' },
      call: { number: '02', label: 'Réserver un appel' },
    },
    calendlyTitle: 'Réserver un appel de 30 min',
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
