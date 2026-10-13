import type { Tint } from './tints';

export type JobId = 'saper-vedere' | 'pulselife-react' | 'pulselife-vue';

export interface Job {
  id: JobId;
  tint: Extract<Tint, 'indigo' | 'cyan' | 'violet'>;
  technologies: readonly string[];
}

/** Career timeline, most recent first; the wording lives in `ui/experience/messages.ts`. */
export const JOBS: readonly Job[] = [
  { id: 'saper-vedere', tint: 'indigo', technologies: ['Vue 3', 'TypeScript', 'AI Workflows'] },
  {
    id: 'pulselife-react',
    tint: 'cyan',
    technologies: ['React', 'React Native', 'GraphQL', 'AWS'],
  },
  { id: 'pulselife-vue', tint: 'violet', technologies: ['Vue.js'] },
];
