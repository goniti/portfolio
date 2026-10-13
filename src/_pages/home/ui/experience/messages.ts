import type { Localized } from '@/shared/lib/i18n';
import type { JobId } from '../../model/experience';

interface JobCopy {
  company: string;
  role: string;
  dates: string;
  achievements: string[];
}

const en = {
  eyebrow: '01 — Experience',
  title: 'Five years shipping product inside two startups.',
  technologiesLabel: 'Technologies',
  jobs: {
    'saper-vedere': {
      company: 'Saper Vedere',
      role: 'Tech Lead / Front-End Dev',
      dates: 'Jul 2024 — Present',
      achievements: [
        'Advisum platform: UI script automation.',
        'Mentoring 3 junior developers.',
        'Follaw refactoring.',
        'Real-time monitoring with Sentry & Slack.',
      ],
    },
    'pulselife-react': {
      company: 'PulseLife',
      role: 'Front-End Dev',
      dates: 'Jan 2022 — Jun 2024',
      achievements: [
        'iOS / Android / Web modernization.',
        'Storybook design system.',
        'Bipper medical messaging app (GraphQL, AWS).',
      ],
    },
    'pulselife-vue': {
      company: 'PulseLife',
      role: 'Front-End Dev',
      dates: 'Jul 2021 — Jan 2022',
      achievements: ['Medical decision tree interfaces.', 'Shared component library.'],
    },
  } satisfies Record<JobId, JobCopy>,
};

export const experienceMessages: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: '01 — Expérience',
    title: 'Cinq ans à livrer du produit dans deux startups.',
    technologiesLabel: 'Technologies',
    jobs: {
      'saper-vedere': {
        company: 'Saper Vedere',
        role: 'Tech Lead / Front-End Dev',
        dates: 'Juil. 2024 — Aujourd’hui',
        achievements: [
          'Plateforme Advisum : automatisation de scripts UI.',
          'Mentorat de 3 développeurs juniors.',
          'Refonte de Follaw.',
          'Monitoring temps réel avec Sentry & Slack.',
        ],
      },
      'pulselife-react': {
        company: 'PulseLife',
        role: 'Front-End Dev',
        dates: 'Janv. 2022 — Juin 2024',
        achievements: [
          'Modernisation iOS / Android / Web.',
          'Design system Storybook.',
          'Bipper, messagerie médicale (GraphQL, AWS).',
        ],
      },
      'pulselife-vue': {
        company: 'PulseLife',
        role: 'Front-End Dev',
        dates: 'Juil. 2021 — Janv. 2022',
        achievements: [
          'Interfaces d’arbres de décision médicaux.',
          'Bibliothèque de composants partagée.',
        ],
      },
    },
  },
};
