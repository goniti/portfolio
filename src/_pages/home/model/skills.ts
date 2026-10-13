import type { Tint } from './tints';

export interface CoreTechnology {
  name: string;
  tint: Tint;
}

/** Daily front-end stack, each with its brand-ish tint. */
export const CORE_STACK: readonly CoreTechnology[] = [
  { name: 'React', tint: 'cyan' },
  { name: 'React Native', tint: 'cyan' },
  { name: 'Vue 3', tint: 'emerald' },
  { name: 'TypeScript', tint: 'indigo' },
  { name: 'Tailwind CSS', tint: 'sky' },
  { name: 'TanStack', tint: 'amber' },
  { name: 'Framer Motion', tint: 'violet' },
];

export const BACKEND_STACK: readonly string[] = [
  'Node.js',
  'NestJS',
  'Fastify',
  'GraphQL',
  'PostgreSQL',
  'Prisma',
  'Keycloak',
];

export type AiPracticeId = 'agents' | 'tdd' | 'prompting' | 'ci';
export const AI_PRACTICES: readonly AiPracticeId[] = ['agents', 'tdd', 'prompting', 'ci'];

export type LeadershipSkillId = 'leadership' | 'mentoring' | 'agile';
export const LEADERSHIP_SKILLS: readonly LeadershipSkillId[] = ['leadership', 'mentoring', 'agile'];
