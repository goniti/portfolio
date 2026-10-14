import type { Localized } from '@/shared/lib/i18n';

// The section title and the skills themselves are content (Sanity); the card titles name the
// fixed slots of the layout.
const en = {
  eyebrow: '02 — Skills',
  core: { title: 'Core Stack', caption: 'daily drivers' },
  backend: { title: 'Backend & Architecture' },
  ai: { title: 'AI-Driven Development', badge: 'workflow' },
  leadership: { title: 'Methodologies & Leadership' },
};

export const skillsMessages: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: '02 — Compétences',
    core: { title: 'Stack principale', caption: 'au quotidien' },
    backend: { title: 'Backend & Architecture' },
    ai: { title: 'Développement piloté par l’IA', badge: 'workflow' },
    leadership: { title: 'Méthodes & leadership' },
  },
};
