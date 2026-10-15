import type { Localized } from '@/shared/lib/i18n';
import type { HomeContent, Sector } from './content';

/*
 * The home page content as published in Sanity on 2026-10-14, plus the person and the reworded SEO
 * fields of #16 (not yet published), in the shape the sections consume.
 * Two uses: tests and stories render it (they never fetch), and `studio/seed/seed.ts` imports it
 * to (re)create the documents. Sanity is the source of truth: this copy is not kept in sync.
 */

const both = (en: string, fr: string = en): Localized<string> => ({ en, fr });

const CDN = 'https://cdn.sanity.io/images/8i6zw2b7/production';

/** The owner's public Calendly page (`NEXT_PUBLIC_CALENDLY_URL` on the site), for tests and stories. */
export const CALENDLY_URL_FIXTURE =
  'https://calendly.com/gonzalezlovullocarlos/30-minutes-google-meet';

/** Industry sectors of the jobs: two jobs of the same sector share its name and its tint. */
export const SECTORS_FIXTURE = {
  publicAffairs: {
    id: 'sector-public-affairs',
    name: both('Public affairs & influence', 'Affaires publiques & influence'),
    tint: 'amber',
  },
  medTech: { id: 'sector-medtech', name: both('MedTech'), tint: 'emerald' },
} as const satisfies Record<string, Sector>;

export const HOME_CONTENT_FIXTURE: HomeContent = {
  site: {
    ownerName: 'Carlos G. Lo Vullo',
    avatarUrl: `${CDN}/872539b062a5e95729ec262994b4ec387a7a8bb5-123x123.png?w=160&h=160&fit=crop&auto=format`,
    links: {
      email: 'gonzalezlovullocarlos@gmail.com',
      github: { url: 'https://github.com/goniti', handle: 'goniti' },
      linkedin: {
        url: 'https://www.linkedin.com/in/carlos-gonzalez-lo-vullo',
        name: 'Carlos Gonzalez Lo Vullo',
      },
    },
    openToWork: true,
    person: {
      fullName: 'Carlos Gonzalez Lo Vullo',
      alternateName: 'Carlos G. Lo Vullo',
      jobTitle: both('Lead Front-End Developer', 'Lead Développeur Front-End'),
      location: { locality: 'Lyon', country: 'FR', remote: true },
      sameAs: ['https://github.com/goniti', 'https://www.linkedin.com/in/carlos-gonzalez-lo-vullo'],
    },
    status: {
      open: both(
        'Open to Tech Lead & Senior Roles • Based in Lyon / Remote',
        'Ouvert aux postes Tech Lead & Senior • Lyon / Télétravail',
      ),
      busy: both(
        'Currently heads-down • Based in Lyon / Remote',
        'Actuellement en poste • Lyon / Télétravail',
      ),
    },
    credits: [
      both('© 2026 Carlos Gonzalez Lo Vullo'),
      both('Built with React + Framer Motion', 'Conçu avec React + Framer Motion'),
      both('Designed & coded in Lyon', 'Designé & codé à Lyon'),
    ],
    seo: {
      title: both(
        'Carlos Gonzalez Lo Vullo — Lead Front-End Developer, Lyon',
        'Carlos Gonzalez Lo Vullo — Lead Développeur Front-End, Lyon',
      ),
      description: both(
        'Carlos Gonzalez Lo Vullo, Lead Front-End Developer in Lyon, France · Remote. React, Vue and TypeScript architecture with AI-augmented workflows.',
        'Carlos Gonzalez Lo Vullo, Lead Développeur Front-End à Lyon, France · Télétravail. Architecture React, Vue et TypeScript, workflows augmentés par l’IA.',
      ),
    },
  },
  hero: {
    badge: both('Tech Lead & Senior Front-End Engineer • Lyon, France'),
    // Non-breaking hyphen (‑) and space ( ) keep “Front-End |” on one line.
    titleStart: both(
      'Lead Front‑End | Modern Web Architecture & ',
      'Tech Lead Front‑End | Architecture Web Moderne & ',
    ),
    titleHighlight: both('AI-Augmented Workflows', 'Productivité augmentée par l’IA'),
    titleEnd: both('.', ''),
    lead: both(
      '5 years & 2 startups: led 2 full rebrandings and built 2 zero-to-one apps. Specializing in React, Vue, TS, and AI-Driven Workflows (Claude Code, Cursor).',
      '5 ans & 2 startups : 2 refontes de marque menées et 2 apps construites de zéro. Spécialisé en React, Vue, TS et workflows pilotés par l’IA (Claude Code, Cursor).',
    ),
    terminalScript: [
      both('whoami'),
      both('carlos — tech lead @ saper vedere'),
      both('stack --core'),
      both('react · vue 3 · typescript · react native'),
      both('claude "add tests for useCheckout"'),
      both('✓ 14 tests written · vitest passing'),
      both('status'),
      both('open to tech lead & senior roles'),
    ],
    focus: both('React · AI'),
  },
  sectionTitles: {
    experience: both(
      'Five years shipping product inside two startups.',
      'Cinq ans à livrer du produit dans deux startups.',
    ),
    skills: both(
      'Front-end depth, full-stack range, AI in the loop.',
      'Expertise front-end, vision full-stack, IA dans la boucle.',
    ),
    projects: both('Selected work.', 'Projets choisis.'),
    watch: both('Watch notes.', 'Notes de veille.'),
  },
  skills: {
    coreStack: [
      { _key: 'react', name: 'React', tint: 'cyan' },
      { _key: 'react-native', name: 'React Native', tint: 'cyan' },
      { _key: 'vue', name: 'Vue 3', tint: 'emerald' },
      { _key: 'typescript', name: 'TypeScript', tint: 'indigo' },
      { _key: 'tailwind', name: 'Tailwind CSS', tint: 'sky' },
      { _key: 'tanstack', name: 'TanStack', tint: 'amber' },
      { _key: 'framer-motion', name: 'Framer Motion', tint: 'violet' },
    ],
    backendStack: ['Node.js', 'NestJS', 'Fastify', 'GraphQL', 'PostgreSQL', 'Prisma', 'Keycloak'],
    aiPractices: [
      {
        _key: 'agents',
        title: both('Autonomous agents', 'Agents autonomes'),
        description: both(
          'Claude Code and Cursor on scoped, reviewable tasks.',
          'Claude Code et Cursor sur des tâches cadrées et relisibles.',
        ),
      },
      {
        _key: 'tdd',
        title: both('AI-guided TDD', 'TDD guidé par l’IA'),
        description: both(
          'Failing test first, agent drafts the implementation.',
          'Le test d’abord, l’agent propose l’implémentation.',
        ),
      },
      {
        _key: 'prompting',
        title: both('Prompt Engineering'),
        description: both(
          'Reusable project prompts and conventions files.',
          'Prompts projet et fichiers de conventions réutilisables.',
        ),
      },
      {
        _key: 'ci',
        title: both('CI/CD automation', 'Automatisation CI/CD'),
        description: both('GitHub Actions · Sentry · Vitest.'),
      },
    ],
    leadership: [
      {
        _key: 'leadership',
        title: both('Tech Leadership'),
        description: both(
          'Architecture decisions, code review, delivery.',
          'Choix d’architecture, revue de code, livraison.',
        ),
        monogram: 'TL',
      },
      {
        _key: 'mentoring',
        title: both('Junior Mentorship', 'Mentorat de juniors'),
        description: both(
          'Pairing, onboarding, growth plans.',
          'Pair programming, onboarding, progression.',
        ),
        monogram: 'MT',
      },
      {
        _key: 'agile',
        title: both('Agile Architecture', 'Architecture agile'),
        description: both('Scrum / Kanban.'),
        monogram: 'AG',
      },
    ],
  },
  contact: {
    title: both('Let’s build the next one together.', 'Construisons le prochain ensemble.'),
    lead: both(
      'Hiring a tech lead or senior front-end engineer? Send a message or reach out directly.',
      'Vous recrutez un tech lead ou un développeur front-end senior ? Écrivez-moi ou contactez-moi directement.',
    ),
  },
  jobs: [
    {
      id: 'job-saper-vedere',
      company: 'Saper Vedere',
      role: both('Tech Lead / Front-End Dev'),
      summary: both(
        'Public affairs consultancy building influence and monitoring tools.',
        'Cabinet d’affaires publiques qui conçoit des outils d’influence et de veille.',
      ),
      sector: SECTORS_FIXTURE.publicAffairs,
      startDate: '2024-07-01',
      endDate: null,
      achievements: [
        both(
          'Advisum platform: UI script automation.',
          'Plateforme Advisum : automatisation de scripts UI.',
        ),
        both('Mentoring 3 junior developers.', 'Mentorat de 3 développeurs juniors.'),
        both('Follaw refactoring.', 'Refonte de Follaw.'),
        both(
          'Real-time monitoring with Sentry & Slack.',
          'Monitoring temps réel avec Sentry & Slack.',
        ),
      ],
      technologies: ['Vue 3', 'TypeScript', 'AI Workflows'],
    },
    {
      id: 'job-pulselife-react',
      company: 'PulseLife',
      role: both('Front-End Dev'),
      summary: both(
        'Health-tech company building clinical apps for care teams.',
        'Entreprise de santé numérique qui conçoit des applications cliniques pour les soignants.',
      ),
      sector: SECTORS_FIXTURE.medTech,
      startDate: '2022-01-01',
      endDate: '2024-06-01',
      achievements: [
        both('iOS / Android / Web modernization.', 'Modernisation iOS / Android / Web.'),
        both('Storybook design system.', 'Design system Storybook.'),
        both(
          'Bipper medical messaging app (GraphQL, AWS).',
          'Bipper, messagerie médicale (GraphQL, AWS).',
        ),
      ],
      technologies: ['React', 'React Native', 'GraphQL', 'AWS'],
    },
    {
      id: 'job-pulselife-vue',
      company: 'PulseLife',
      role: both('Front-End Dev'),
      summary: both(
        'Health-tech company building clinical apps for care teams.',
        'Entreprise de santé numérique qui conçoit des applications cliniques pour les soignants.',
      ),
      sector: SECTORS_FIXTURE.medTech,
      startDate: '2021-07-01',
      endDate: '2022-01-01',
      achievements: [
        both('Medical decision tree interfaces.', 'Interfaces d’arbres de décision médicaux.'),
        both('Shared component library.', 'Bibliothèque de composants partagée.'),
      ],
      technologies: ['Vue.js'],
    },
  ],
  projects: [
    {
      id: 'project-meeple',
      title: both(
        'Meeple — association management SaaS',
        'Meeple — SaaS de gestion d’associations',
      ),
      kind: both('Personal project · Full-Stack', 'Projet perso · Full-Stack'),
      description: both(
        'Events, openings, checklists, inventory and tabs for board-game associations. Keycloak auth, NestJS/Fastify API, OWASP-hardened VPS.',
        'Événements, ouvertures, checklists, inventaire et ardoises pour associations ludiques. Auth Keycloak, API NestJS/Fastify, VPS durci OWASP.',
      ),
      placeholder: null,
      image: {
        src: `${CDN}/3e98555d0f41e34d74b84e350e889734d3fc69aa-1594x904.png?w=1200&auto=format`,
        lqip: null,
        alt: both(
          'Meeple — association management SaaS',
          'Meeple — SaaS de gestion d’associations',
        ),
      },
      categories: ['react', 'full-stack', 'side-projects'],
      technologies: ['React', 'NestJS', 'Fastify', 'Keycloak', 'OWASP'],
      tint: 'amber',
      demoUrl: null,
      sourceUrl: 'https://github.com/goniti',
    },
    {
      id: 'project-bipper',
      title: both('Real-Time Medical Messenger', 'Messagerie médicale temps réel'),
      kind: both('Bipper · PulseLife'),
      description: both(
        'Secure messaging for healthcare teams on iOS, Android and web, with real-time GraphQL on AWS.',
        'Messagerie sécurisée pour équipes soignantes sur iOS, Android et web, GraphQL temps réel sur AWS.',
      ),
      placeholder: both('app screen recording'),
      image: null,
      categories: ['react', 'mobile'],
      technologies: ['React Native', 'GraphQL', 'AWS'],
      tint: 'cyan',
      demoUrl: null,
      sourceUrl: 'https://github.com/goniti',
    },
    {
      id: 'project-advisum',
      title: both('UI Automation & Audit Tool', 'Outil d’automatisation & d’audit UI'),
      kind: both('Advisum · Saper Vedere'),
      description: both(
        'Scripted guided tours and automated UI audits across the Advisum platform.',
        'Parcours guidés scriptés et audits UI automatisés sur la plateforme Advisum.',
      ),
      placeholder: both('dashboard screenshot'),
      image: null,
      categories: ['vue'],
      technologies: ['Vue 3', 'TypeScript', 'Shepherd'],
      tint: 'emerald',
      demoUrl: null,
      sourceUrl: 'https://github.com/goniti',
    },
    {
      id: 'project-maillons',
      title: both('Les Maillons Ludiques'),
      kind: both('Side project · Website', 'Projet perso · Site web'),
      description: both(
        'Website for a board-game association in Machezal: events, library, membership and gallery.',
        'Site d’une association de jeux de société à Machezal : soirées, ludothèque, adhésion et galerie.',
      ),
      placeholder: null,
      image: {
        src: `${CDN}/51e0f35e4ad5eaf6739ecaeb8af0cf172d1b09b8-1691x1027.png?w=1200&auto=format`,
        lqip: null,
        alt: both('Les Maillons Ludiques'),
      },
      categories: ['side-projects'],
      technologies: ['Website', 'Branding', 'Responsive'],
      tint: 'emerald',
      demoUrl: null,
      sourceUrl: 'https://github.com/goniti',
    },
    {
      id: 'project-design-system',
      title: both('Storybook Design System'),
      kind: both('PulseLife'),
      description: both(
        'Shared component library documented in Storybook, used across mobile and web apps.',
        'Bibliothèque de composants documentée dans Storybook, partagée entre apps mobile et web.',
      ),
      placeholder: both('storybook capture'),
      image: null,
      categories: ['react'],
      technologies: ['React', 'Storybook', 'TypeScript'],
      tint: 'violet',
      demoUrl: null,
      sourceUrl: 'https://github.com/goniti',
    },
    {
      id: 'project-decision-trees',
      title: both('Medical Decision Trees', 'Arbres de décision médicaux'),
      kind: both('PulseLife'),
      description: both(
        'Interfaces guiding clinicians through decision trees, on a shared Vue component library.',
        'Interfaces guidant les soignants dans des arbres de décision, sur une bibliothèque Vue partagée.',
      ),
      placeholder: both('flow diagram'),
      image: null,
      categories: ['vue'],
      technologies: ['Vue.js', 'Components'],
      tint: 'sky',
      demoUrl: null,
      sourceUrl: 'https://github.com/goniti',
    },
  ],
  notes: [
    {
      id: 'note-ai-workflows',
      title: both('AI-Driven Workflows'),
      publishedAt: '2026-10-01',
      category: 'ai',
      readingMinutes: 5,
      excerpt: both(
        'Orchestrating Claude Code & Cursor agents with TDD for zero-regression shipping.',
        'Orchestrer les agents Claude Code & Cursor avec le TDD pour livrer sans régression.',
      ),
      body: [
        both(
          'I treat Claude Code and Cursor as teammates inside a strict loop: a failing test defines the change, the agent proposes an implementation, CI decides whether it lands.',
          'Je traite Claude Code et Cursor comme des coéquipiers dans une boucle stricte : un test qui échoue définit le changement, l’agent propose une implémentation, la CI décide si elle est mergée.',
        ),
        both(
          'Each agent task fits in one reviewable diff. Conventions files and project prompts keep output consistent across the codebase.',
          'Chaque tâche tient dans un diff relisible. Fichiers de conventions et prompts projet gardent le code cohérent.',
        ),
      ],
      takeaways: [
        both('The test is the contract with the agent.', 'Le test est le contrat avec l’agent.'),
        both('One task, one diff, one review.', 'Une tâche, un diff, une revue.'),
        both('CI is the final gate, not the agent.', 'La CI tranche, pas l’agent.'),
      ],
    },
    {
      id: 'note-server-components',
      title: both('React Server Components & Streaming'),
      publishedAt: '2026-09-01',
      category: 'front-end',
      readingMinutes: 6,
      excerpt: both(
        'Architecture patterns for ultra-fast initial page loads and seamless UI state.',
        'Patterns d’architecture pour des chargements initiaux ultra-rapides et un état UI fluide.',
      ),
      body: [
        both(
          'Server Components move data fetching to the server and ship less JavaScript. Streaming with Suspense paints the shell immediately while slower data arrives.',
          'Les Server Components déplacent la récupération de données côté serveur et envoient moins de JavaScript. Le streaming avec Suspense affiche la structure immédiatement.',
        ),
        both(
          'The design work is in placing boundaries: interactive islands stay small and client state lives at the leaves.',
          'Le vrai travail : placer les frontières. Les îlots interactifs restent petits, l’état client vit dans les feuilles.',
        ),
      ],
      takeaways: [
        both(
          'Push client boundaries to the leaves.',
          'Repousser les frontières client vers les feuilles.',
        ),
        both(
          'Stream the shell, suspend the slow parts.',
          'Streamer la structure, suspendre le lent.',
        ),
        both('Measure bundle size before and after.', 'Mesurer le bundle avant et après.'),
      ],
    },
    {
      id: 'note-design-systems',
      title: both('Design System Scaling'),
      publishedAt: '2026-08-01',
      category: 'ux',
      readingMinutes: 4,
      excerpt: both(
        'Building resilient UI component libraries using Storybook, Tailwind Variants, and Radix primitives.',
        'Construire des bibliothèques de composants robustes avec Storybook, Tailwind Variants et les primitives Radix.',
      ),
      body: [
        both(
          'Radix primitives handle accessibility and keyboard behaviour, Tailwind Variants encode the visual API, and Storybook documents every state.',
          'Les primitives Radix gèrent l’accessibilité et le clavier, Tailwind Variants porte l’API visuelle, Storybook documente chaque état.',
        ),
        both(
          'Separating behaviour from styling lets a library survive a rebrand without rewriting components.',
          'Séparer comportement et style permet à une bibliothèque de survivre à une refonte sans réécrire les composants.',
        ),
      ],
      takeaways: [
        both(
          'Primitives for behaviour, variants for style.',
          'Primitives pour le comportement, variants pour le style.',
        ),
        both('Every state gets a story.', 'Chaque état a sa story.'),
        both('Tokens make rebrands cheap.', 'Les tokens rendent les refontes peu coûteuses.'),
      ],
    },
    {
      id: 'note-real-time',
      title: both('Real-time Web Architectures'),
      publishedAt: '2026-07-01',
      category: 'architecture',
      readingMinutes: 5,
      excerpt: both(
        'Polling strategies, WebSockets and Server-Sent Events: choosing the right transport.',
        'Polling, WebSockets et Server-Sent Events : choisir le bon transport.',
      ),
      body: [
        both(
          'Polling is simple and cache-friendly, long polling cuts wasted requests, and WebSockets or SSE push updates as they happen.',
          'Le polling est simple et compatible cache, le long polling réduit les requêtes inutiles, WebSockets et SSE poussent les mises à jour en direct.',
        ),
        both(
          'The right choice depends on update frequency, traffic direction and infrastructure constraints.',
          'Le bon choix dépend de la fréquence des mises à jour, du sens du trafic et des contraintes d’infrastructure.',
        ),
      ],
      takeaways: [
        both(
          'Start with polling, measure, then upgrade.',
          'Commencer par du polling, mesurer, puis faire évoluer.',
        ),
        both('SSE for server-to-client streams.', 'SSE pour les flux serveur → client.'),
        both('WebSockets when both sides talk.', 'WebSockets quand les deux côtés parlent.'),
      ],
    },
  ],
};
