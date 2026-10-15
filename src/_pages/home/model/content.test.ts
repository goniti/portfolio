import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import type { z } from 'zod';
import type { HOME_CONTENT_QUERY_RESULT } from '@/shared/api';
import { homeContentSchema } from './content';

// Image URLs need the project and dataset; unit tests have no Sanity environment.
vi.mock('@/shared/config/server', () => ({
  env: {
    SANITY_PROJECT_ID: '8i6zw2b7',
    SANITY_DATASET: 'production',
    SANITY_API_VERSION: '2026-10-01',
  },
}));

const both = (en: string, fr: string = en) => [
  { _key: 'en', language: 'en', value: en },
  { _key: 'fr', language: 'fr', value: fr },
];
const lines = (...texts: string[]) =>
  texts.map((text, index) => ({ _key: `l${index}`, text: both(text) }));
const image = (assetId: string) => ({
  asset: { _id: assetId, metadata: { lqip: 'data:image/jpeg;base64,AAAA' } },
  hotspot: null,
  crop: null,
});

/** The raw result of `HOME_CONTENT_QUERY`, trimmed to one document of each collection. */
function rawContent() {
  return {
    siteSettings: {
      _id: 'siteSettings',
      _type: 'siteSettings',
      ownerName: 'Carlos G. Lo Vullo',
      avatar: image('image-872539b062a5e95729ec262994b4ec387a7a8bb5-123x123-png'),
      email: 'gonzalezlovullocarlos@gmail.com',
      githubUrl: 'https://github.com/goniti',
      githubHandle: 'goniti',
      linkedinUrl: null,
      linkedinName: null,
      openToWork: true,
      status: { open: both('Open', 'Ouvert'), busy: both('Busy', 'Occupé') },
      credits: lines('© 2026'),
      seo: { title: both('Title', 'Titre'), description: both('About', 'À propos') },
    },
    homePage: {
      _id: 'homePage',
      _type: 'homePage',
      hero: {
        badge: both('Badge'),
        titleStart: both('Lead '),
        titleHighlight: both('AI', 'IA'),
        titleEnd: both('.', ''),
        lead: both('Lead'),
        terminalScript: lines('1', '2', '3', '4', '5', '6', '7', '8'),
        focus: both('React · AI'),
      },
      sections: {
        experience: both('Experience'),
        skills: both('Skills'),
        projects: both('Projects'),
        watch: both('Watch'),
      },
      skills: {
        coreStack: [{ _key: 'react', name: 'React', tint: 'cyan' }],
        backendStack: ['Node.js'],
        aiPractices: [{ _key: 'tdd', title: both('TDD'), description: both('Tests first') }],
        leadership: [
          { _key: 'tl', title: both('Lead'), description: both('Reviews'), monogram: 'TL' },
        ],
      },
      contact: { title: both('Hi', 'Salut'), lead: both('Write', 'Écrivez') },
    },
    jobs: [
      {
        _id: 'job-saper-vedere',
        _type: 'job',
        company: 'Saper Vedere',
        role: both('Tech Lead'),
        startDate: '2024-07-01',
        endDate: null,
        achievements: lines('Shipped'),
        technologies: ['Vue 3'],
        tint: 'indigo',
      },
    ],
    projects: [
      {
        _id: 'project-meeple',
        _type: 'project',
        title: both('Meeple'),
        kind: both('Side project', 'Projet perso'),
        description: both('SaaS'),
        placeholder: null,
        image: {
          ...image('image-3e98555d0f41e34d74b84e350e889734d3fc69aa-1594x904-png'),
          alt: both('Meeple'),
        },
        categories: ['react'],
        technologies: ['React'],
        tint: 'amber',
        demoUrl: null,
        sourceUrl: 'https://github.com/goniti',
      },
    ],
    notes: [
      {
        _id: 'note-real-time',
        _type: 'watchNote',
        title: both('Real-time'),
        publishedAt: '2026-07-01',
        category: 'architecture',
        readingMinutes: 5,
        excerpt: both('Polling'),
        body: lines('Paragraph'),
        takeaways: lines('Measure'),
      },
    ],
  };
}

describe('homeContentSchema', () => {
  it('maps the raw query result to the page content', () => {
    const content = homeContentSchema.parse(rawContent());
    expect(content.site.links.linkedin).toBeNull();
    expect(content.site.avatarUrl).toBe(
      'https://cdn.sanity.io/images/8i6zw2b7/production/872539b062a5e95729ec262994b4ec387a7a8bb5-123x123.png?w=160&h=160&fit=crop&auto=format',
    );
    expect(content.hero.titleEnd).toEqual({ en: '.', fr: '' });
    expect(content.jobs[0]).toMatchObject({ id: 'job-saper-vedere', endDate: null });
    expect(content.projects[0]?.image).toEqual({
      src: 'https://cdn.sanity.io/images/8i6zw2b7/production/3e98555d0f41e34d74b84e350e889734d3fc69aa-1594x904.png?w=1200&auto=format',
      lqip: 'data:image/jpeg;base64,AAAA',
      alt: { en: 'Meeple', fr: 'Meeple' },
    });
    expect(content.notes[0]?.body).toEqual([{ en: 'Paragraph', fr: 'Paragraph' }]);
  });

  describe('person', () => {
    const person = (jobTitle = both('Lead Front-End Developer', 'Lead Développeur Front-End')) => ({
      fullName: 'Carlos Gonzalez Lo Vullo',
      jobTitle,
      location: { locality: 'Lyon', country: 'FR', remote: true },
    });

    it('derives the alternate name and the other profiles from the owner fields', () => {
      const raw = rawContent();
      Object.assign(raw.siteSettings, {
        person: person(),
        linkedinUrl: 'https://www.linkedin.com/in/carlos-gonzalez-lo-vullo',
        linkedinName: 'Carlos Gonzalez Lo Vullo',
      });
      expect(homeContentSchema.parse(raw).site.person).toEqual({
        fullName: 'Carlos Gonzalez Lo Vullo',
        alternateName: 'Carlos G. Lo Vullo',
        jobTitle: { en: 'Lead Front-End Developer', fr: 'Lead Développeur Front-End' },
        location: { locality: 'Lyon', country: 'FR', remote: true },
        sameAs: [
          'https://github.com/goniti',
          'https://www.linkedin.com/in/carlos-gonzalez-lo-vullo',
        ],
      });
    });

    it('is null until the owner fills it', () => {
      expect(homeContentSchema.parse(rawContent()).site.person).toBeNull();
    });

    it('requires the job title in every locale once set', () => {
      const raw = rawContent();
      Object.assign(raw.siteSettings, { person: person(both('Lead').slice(0, 1)) });
      expect(homeContentSchema.safeParse(raw).error?.issues.map((issue) => issue.path)).toEqual([
        ['siteSettings', 'person', 'jobTitle'],
      ]);
    });

    it('rejects a country that is not a two-letter code', () => {
      const raw = rawContent();
      const lyon = person();
      Object.assign(raw.siteSettings, {
        person: { ...lyon, location: { ...lyon.location, country: 'France' } },
      });
      expect(homeContentSchema.safeParse(raw).error?.issues.map((issue) => issue.path)).toEqual([
        ['siteSettings', 'person', 'location', 'country'],
      ]);
    });
  });

  it('requires a screenshot or a placeholder caption', () => {
    const raw = rawContent();
    const [project] = raw.projects;
    if (project) Object.assign(project, { image: null });
    expect(homeContentSchema.safeParse(raw).error?.issues.map((issue) => issue.path)).toEqual([
      ['projects', 0, 'placeholder'],
    ]);
  });

  it('requires the eight lines of the terminal script', () => {
    const raw = rawContent();
    raw.homePage.hero.terminalScript = lines('only one');
    expect(homeContentSchema.safeParse(raw).success).toBe(false);
  });

  it('rejects a category the code does not know', () => {
    const raw = rawContent();
    const [note] = raw.notes;
    if (note) note.category = 'gossip';
    expect(homeContentSchema.safeParse(raw).success).toBe(false);
  });

  it('accepts every result TypeGen can produce once the singletons exist', () => {
    // Drift guard (ADR-003): a schema or query change that the zod schemas do not follow fails
    // `pnpm typecheck`. TypeGen types a `*[_id == "…"][0]` singleton as `T | null`: only that
    // top-level null is stripped (a missing singleton is a runtime error, reported by the content
    // check), so every field inside keeps its own nullability and the collections are compared as is.
    type Singleton = 'siteSettings' | 'homePage';
    expectTypeOf<Extract<HOME_CONTENT_QUERY_RESULT['siteSettings'], null>>().toEqualTypeOf<null>();
    expectTypeOf<Extract<HOME_CONTENT_QUERY_RESULT['homePage'], null>>().toEqualTypeOf<null>();
    type PublishedContent = Omit<HOME_CONTENT_QUERY_RESULT, Singleton> & {
      [Key in Singleton]: NonNullable<HOME_CONTENT_QUERY_RESULT[Key]>;
    };
    expectTypeOf<PublishedContent>().toExtend<z.input<typeof homeContentSchema>>();
  });
});
