import type { Localized } from '@/shared/lib/i18n';
import type { NoteFilter, NoteId } from '../../model/notes';

interface NoteCopy {
  title: string;
  date: string;
  excerpt: string;
  body: string[];
  takeaways: string[];
}

const en = {
  eyebrow: '04 — AI & Tech Watch',
  continuous: 'Continuous Watch',
  title: 'Watch notes.',
  filtersLabel: 'Filter notes',
  filters: {
    all: 'All',
    ai: 'AI',
    'front-end': 'Front-End',
    architecture: 'Architecture',
    ux: 'UX',
  } satisfies Record<NoteFilter, string>,
  categoryTag: (category: string) => `#${category}`,
  cardMeta: (date: string, minutes: number) => `${date} · ${minutes} min`,
  dialogMeta: (category: string, date: string, minutes: number) =>
    `#${category} · ${date} · ${minutes} min`,
  readNote: 'Read note →',
  takeaways: 'Takeaways',
  takeawayGlyph: '→',
  close: 'esc',
  closeLabel: 'Close the note',
  notes: {
    'ai-workflows': {
      title: 'AI-Driven Workflows',
      date: 'Oct 2026',
      excerpt: 'Orchestrating Claude Code & Cursor agents with TDD for zero-regression shipping.',
      body: [
        'I treat Claude Code and Cursor as teammates inside a strict loop: a failing test defines the change, the agent proposes an implementation, CI decides whether it lands.',
        'Each agent task fits in one reviewable diff. Conventions files and project prompts keep output consistent across the codebase.',
      ],
      takeaways: [
        'The test is the contract with the agent.',
        'One task, one diff, one review.',
        'CI is the final gate, not the agent.',
      ],
    },
    'server-components': {
      title: 'React Server Components & Streaming',
      date: 'Sep 2026',
      excerpt: 'Architecture patterns for ultra-fast initial page loads and seamless UI state.',
      body: [
        'Server Components move data fetching to the server and ship less JavaScript. Streaming with Suspense paints the shell immediately while slower data arrives.',
        'The design work is in placing boundaries: interactive islands stay small and client state lives at the leaves.',
      ],
      takeaways: [
        'Push client boundaries to the leaves.',
        'Stream the shell, suspend the slow parts.',
        'Measure bundle size before and after.',
      ],
    },
    'design-systems': {
      title: 'Design System Scaling',
      date: 'Aug 2026',
      excerpt:
        'Building resilient UI component libraries using Storybook, Tailwind Variants, and Radix primitives.',
      body: [
        'Radix primitives handle accessibility and keyboard behaviour, Tailwind Variants encode the visual API, and Storybook documents every state.',
        'Separating behaviour from styling lets a library survive a rebrand without rewriting components.',
      ],
      takeaways: [
        'Primitives for behaviour, variants for style.',
        'Every state gets a story.',
        'Tokens make rebrands cheap.',
      ],
    },
    'real-time': {
      title: 'Real-time Web Architectures',
      date: 'Jul 2026',
      excerpt:
        'Polling strategies, WebSockets and Server-Sent Events: choosing the right transport.',
      body: [
        'Polling is simple and cache-friendly, long polling cuts wasted requests, and WebSockets or SSE push updates as they happen.',
        'The right choice depends on update frequency, traffic direction and infrastructure constraints.',
      ],
      takeaways: [
        'Start with polling, measure, then upgrade.',
        'SSE for server-to-client streams.',
        'WebSockets when both sides talk.',
      ],
    },
  } satisfies Record<NoteId, NoteCopy>,
};

export const watchMessages: Localized<typeof en> = {
  en,
  fr: {
    ...en,
    eyebrow: '04 — Veille IA & Tech',
    continuous: 'Veille continue',
    title: 'Notes de veille.',
    filtersLabel: 'Filtrer les notes',
    filters: { ...en.filters, all: 'Tous', ai: 'IA' },
    readNote: 'Lire la note →',
    takeaways: 'À retenir',
    closeLabel: 'Fermer la note',
    notes: {
      'ai-workflows': {
        title: 'AI-Driven Workflows',
        date: 'Oct. 2026',
        excerpt:
          'Orchestrer les agents Claude Code & Cursor avec le TDD pour livrer sans régression.',
        body: [
          'Je traite Claude Code et Cursor comme des coéquipiers dans une boucle stricte : un test qui échoue définit le changement, l’agent propose une implémentation, la CI décide si elle est mergée.',
          'Chaque tâche tient dans un diff relisible. Fichiers de conventions et prompts projet gardent le code cohérent.',
        ],
        takeaways: [
          'Le test est le contrat avec l’agent.',
          'Une tâche, un diff, une revue.',
          'La CI tranche, pas l’agent.',
        ],
      },
      'server-components': {
        title: 'React Server Components & Streaming',
        date: 'Sept. 2026',
        excerpt:
          'Patterns d’architecture pour des chargements initiaux ultra-rapides et un état UI fluide.',
        body: [
          'Les Server Components déplacent la récupération de données côté serveur et envoient moins de JavaScript. Le streaming avec Suspense affiche la structure immédiatement.',
          'Le vrai travail : placer les frontières. Les îlots interactifs restent petits, l’état client vit dans les feuilles.',
        ],
        takeaways: [
          'Repousser les frontières client vers les feuilles.',
          'Streamer la structure, suspendre le lent.',
          'Mesurer le bundle avant et après.',
        ],
      },
      'design-systems': {
        title: 'Design System Scaling',
        date: 'Août 2026',
        excerpt:
          'Construire des bibliothèques de composants robustes avec Storybook, Tailwind Variants et les primitives Radix.',
        body: [
          'Les primitives Radix gèrent l’accessibilité et le clavier, Tailwind Variants porte l’API visuelle, Storybook documente chaque état.',
          'Séparer comportement et style permet à une bibliothèque de survivre à une refonte sans réécrire les composants.',
        ],
        takeaways: [
          'Primitives pour le comportement, variants pour le style.',
          'Chaque état a sa story.',
          'Les tokens rendent les refontes peu coûteuses.',
        ],
      },
      'real-time': {
        title: 'Real-time Web Architectures',
        date: 'Juil. 2026',
        excerpt: 'Polling, WebSockets et Server-Sent Events : choisir le bon transport.',
        body: [
          'Le polling est simple et compatible cache, le long polling réduit les requêtes inutiles, WebSockets et SSE poussent les mises à jour en direct.',
          'Le bon choix dépend de la fréquence des mises à jour, du sens du trafic et des contraintes d’infrastructure.',
        ],
        takeaways: [
          'Commencer par du polling, mesurer, puis faire évoluer.',
          'SSE pour les flux serveur → client.',
          'WebSockets quand les deux côtés parlent.',
        ],
      },
    },
  },
};
