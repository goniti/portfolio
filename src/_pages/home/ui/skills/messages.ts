import type { Localized } from '@/shared/lib/i18n';
import type { AiPracticeId, LeadershipSkillId } from '../../model/skills';

interface DescribedItem {
  title: string;
  description: string;
}

const en = {
  eyebrow: '02 — Skills',
  title: 'Front-end depth, full-stack range, AI in the loop.',
  core: { title: 'Core Stack', caption: 'daily drivers' },
  backend: { title: 'Backend & Architecture' },
  ai: {
    title: 'AI-Driven Development',
    badge: 'workflow',
    practices: {
      agents: {
        title: 'Autonomous agents',
        description: 'Claude Code and Cursor on scoped, reviewable tasks.',
      },
      tdd: {
        title: 'AI-guided TDD',
        description: 'Failing test first, agent drafts the implementation.',
      },
      prompting: {
        title: 'Prompt Engineering',
        description: 'Reusable project prompts and conventions files.',
      },
      ci: { title: 'CI/CD automation', description: 'GitHub Actions · Sentry · Vitest.' },
    } satisfies Record<AiPracticeId, DescribedItem>,
  },
  leadership: {
    title: 'Methodologies & Leadership',
    skills: {
      leadership: {
        title: 'Tech Leadership',
        description: 'Architecture decisions, code review, delivery.',
      },
      mentoring: { title: 'Junior Mentorship', description: 'Pairing, onboarding, growth plans.' },
      agile: { title: 'Agile Architecture', description: 'Scrum / Kanban.' },
    } satisfies Record<LeadershipSkillId, DescribedItem>,
    monograms: { leadership: 'TL', mentoring: 'MT', agile: 'AG' } satisfies Record<
      LeadershipSkillId,
      string
    >,
  },
};

export const skillsMessages: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: '02 — Compétences',
    title: 'Expertise front-end, vision full-stack, IA dans la boucle.',
    core: { title: 'Stack principale', caption: 'au quotidien' },
    backend: { title: 'Backend & Architecture' },
    ai: {
      title: 'Développement piloté par l’IA',
      badge: 'workflow',
      practices: {
        agents: {
          title: 'Agents autonomes',
          description: 'Claude Code et Cursor sur des tâches cadrées et relisibles.',
        },
        tdd: {
          title: 'TDD guidé par l’IA',
          description: 'Le test d’abord, l’agent propose l’implémentation.',
        },
        prompting: {
          title: 'Prompt Engineering',
          description: 'Prompts projet et fichiers de conventions réutilisables.',
        },
        ci: { title: 'Automatisation CI/CD', description: 'GitHub Actions · Sentry · Vitest.' },
      },
    },
    leadership: {
      title: 'Méthodes & leadership',
      skills: {
        leadership: {
          title: 'Tech Leadership',
          description: 'Choix d’architecture, revue de code, livraison.',
        },
        mentoring: {
          title: 'Mentorat de juniors',
          description: 'Pair programming, onboarding, progression.',
        },
        agile: { title: 'Architecture agile', description: 'Scrum / Kanban.' },
      },
      monograms: en.leadership.monograms,
    },
  },
};
