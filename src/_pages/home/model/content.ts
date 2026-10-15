import {
  COUNTRY_CODE_PATTERN,
  NOTE_CATEGORIES,
  PROJECT_CATEGORIES,
  PROJECT_TINTS,
  SECTOR_TINTS,
  TINTS,
} from 'portfolio-content-model';
import { z } from 'zod';
import { localizedString, optionalLocalizedString, urlFor } from '@/shared/api';
import { TERMINAL_SCRIPT_STYLE } from './terminal';

/*
 * Content of the home page, edited in Sanity (ADR-003). These schemas check what TypeGen cannot
 * (both locales of every localized field, enums, non-empty lists) and map the raw query result to
 * the props the sections consume. Proper nouns, URLs and technologies are not localized.
 */

/** Rendered size of the avatar: 2× its 40 px box. */
const AVATAR_SIZE = 160;
/** Width of a project screenshot: a card is at most ~380 px wide, served at 2× with headroom. */
const SCREENSHOT_WIDTH = 1200;

// The issue report reads `_type` from the raw data; the page only needs the `_id`.
const documentFields = { _id: z.string() };

const imageSourceSchema = z.object({
  // `asset->` is null when the upload is missing or still in progress.
  asset: z
    .object({
      _id: z.string(),
      metadata: z.object({ lqip: z.string().nullish() }).nullish(),
    })
    .nullish()
    .transform((asset, context) => {
      if (asset) return asset;
      context.addIssue({ code: 'custom', message: 'the image has no uploaded file' });
      return z.NEVER;
    }),
  hotspot: z
    .object({ x: z.number(), y: z.number(), height: z.number(), width: z.number() })
    .nullish(),
  crop: z
    .object({ top: z.number(), bottom: z.number(), left: z.number(), right: z.number() })
    .nullish(),
});

type ImageSource = z.output<typeof imageSourceSchema>;

/** The Sanity image builder for a queried image (asset reference, crop and hotspot). */
function imageFor({ asset, hotspot, crop }: ImageSource) {
  return urlFor({
    asset: { _ref: asset._id },
    hotspot: hotspot ?? undefined,
    crop: crop ?? undefined,
  });
}

/** Maps a document's `_id` to the `id` the page uses. */
function withId<Document extends { _id: string }>({
  _id,
  ...fields
}: Document): Omit<Document, '_id'> & { id: string } {
  return { id: _id, ...fields };
}

type LineCount = { min: number } | { exactly: number };

/** A list of localized lines (`[{ text }]`): one entry per line, each in both locales. */
function localizedLines(count: LineCount, message?: string) {
  const lines = z.array(z.object({ text: localizedString() }));
  const counted =
    'exactly' in count ? lines.length(count.exactly, message) : lines.min(count.min, message);
  return counted.transform((items) => items.map((item) => item.text));
}

/** Who the site is about: the hero heading and the structured data (schema.org `Person`). */
const personSchema = z.object({
  fullName: z.string().min(1),
  jobTitle: localizedString(),
  location: z.object({
    locality: z.string().min(1),
    country: z.string().regex(COUNTRY_CODE_PATTERN, 'not a two-letter country code'),
    remote: z.boolean(),
  }),
});

const siteSettingsSchema = z
  .object({
    ...documentFields,
    ownerName: z.string().min(1),
    avatar: imageSourceSchema,
    email: z.email(),
    githubUrl: z.url(),
    githubHandle: z.string().min(1),
    linkedinUrl: z.url().nullish(),
    linkedinName: z.string().nullish(),
    openToWork: z.boolean(),
    // Optional until the owner fills it in the Studio (#16): the hero keeps its tagline heading.
    person: personSchema.nullish(),
    status: z.object({ open: localizedString(), busy: localizedString() }),
    credits: localizedLines({ min: 1 }, 'add at least one credit line'),
    seo: z.object({ title: localizedString(), description: localizedString() }),
  })
  .superRefine((settings, context) => {
    if (settings.linkedinUrl && !settings.linkedinName) {
      context.addIssue({
        code: 'custom',
        path: ['linkedinName'],
        message: 'required when the LinkedIn URL is set',
      });
    }
  })
  .transform((settings) => ({
    ownerName: settings.ownerName,
    avatarUrl: imageFor(settings.avatar)
      .width(AVATAR_SIZE)
      .height(AVATAR_SIZE)
      .fit('crop')
      .auto('format')
      .url(),
    links: {
      email: settings.email,
      github: { url: settings.githubUrl, handle: settings.githubHandle },
      linkedin:
        settings.linkedinUrl && settings.linkedinName
          ? { url: settings.linkedinUrl, name: settings.linkedinName }
          : null,
    },
    openToWork: settings.openToWork,
    person: settings.person
      ? {
          ...settings.person,
          alternateName: settings.ownerName,
          sameAs: [settings.githubUrl, settings.linkedinUrl].filter((url) => url != null),
        }
      : null,
    status: settings.status,
    credits: settings.credits,
    seo: settings.seo,
  }));

const describedItemSchema = z.object({
  _key: z.string(),
  title: localizedString(),
  description: localizedString(),
});

const homePageSchema = z.object({
  ...documentFields,
  hero: z.object({
    badge: localizedString(),
    titleStart: localizedString(),
    titleHighlight: localizedString(),
    // The French title ends on its highlighted part: an empty value is valid here.
    titleEnd: localizedString({ allowBlank: true }),
    lead: localizedString(),
    terminalScript: localizedLines(
      { exactly: TERMINAL_SCRIPT_STYLE.length },
      `the terminal script needs exactly ${TERMINAL_SCRIPT_STYLE.length} lines`,
    ),
    focus: localizedString(),
  }),
  sections: z.object({
    experience: localizedString(),
    skills: localizedString(),
    projects: localizedString(),
    watch: localizedString(),
  }),
  skills: z.object({
    coreStack: z
      .array(z.object({ _key: z.string(), name: z.string().min(1), tint: z.enum(TINTS) }))
      .min(1),
    backendStack: z.array(z.string().min(1)).min(1),
    aiPractices: z.array(describedItemSchema).min(1),
    leadership: z.array(describedItemSchema.extend({ monogram: z.string().min(1) })).min(1),
  }),
  contact: z.object({ title: localizedString(), lead: localizedString() }),
});

const sectorSchema = z
  .object({ ...documentFields, name: localizedString(), tint: z.enum(SECTOR_TINTS) })
  .transform(withId);

const jobSchema = z
  .object({
    ...documentFields,
    company: z.string().min(1),
    role: localizedString(),
    summary: optionalLocalizedString(),
    // Required in the Studio, optional here until the owner links every job to a sector (#24):
    // without one the card shows no label and no top line, and keeps the default tint.
    sector: sectorSchema.nullish(),
    startDate: z.iso.date(),
    endDate: z.iso.date().nullish(),
    achievements: localizedLines({ min: 1 }),
    technologies: z.array(z.string().min(1)).min(1),
  })
  .transform(({ summary, sector, endDate, ...job }) => ({
    ...withId(job),
    summary: summary ?? null,
    sector: sector ?? null,
    endDate: endDate ?? null,
  }));

const projectSchema = z
  .object({
    ...documentFields,
    title: localizedString(),
    kind: localizedString(),
    description: localizedString(),
    placeholder: optionalLocalizedString(),
    image: imageSourceSchema.extend({ alt: localizedString() }).nullish(),
    // TypeGen types an array with an `options.list` as `string[]`: narrowed here.
    categories: z.array(z.string()).pipe(z.array(z.enum(PROJECT_CATEGORIES)).min(1)),
    technologies: z.array(z.string().min(1)).min(1),
    tint: z.enum(PROJECT_TINTS),
    demoUrl: z.url().nullish(),
    sourceUrl: z.url(),
  })
  .superRefine((project, context) => {
    if (project.image || project.placeholder) return;
    context.addIssue({
      code: 'custom',
      path: ['placeholder'],
      message: 'required when the project has no screenshot',
    });
  })
  .transform(({ image, demoUrl, ...project }) => ({
    ...withId(project),
    image: image
      ? {
          src: imageFor(image).width(SCREENSHOT_WIDTH).auto('format').url(),
          lqip: image.asset.metadata?.lqip ?? null,
          alt: image.alt,
        }
      : null,
    demoUrl: demoUrl ?? null,
  }));

const watchNoteSchema = z
  .object({
    ...documentFields,
    title: localizedString(),
    publishedAt: z.iso.date(),
    category: z.enum(NOTE_CATEGORIES),
    readingMinutes: z.number().int().positive(),
    excerpt: localizedString(),
    body: localizedLines({ min: 1 }),
    takeaways: localizedLines({ min: 1 }),
  })
  .transform(withId);

/** Parses the result of `HOME_CONTENT_QUERY` (see `api/queries.ts`). */
export const homeContentSchema = z
  .object({
    siteSettings: siteSettingsSchema,
    homePage: homePageSchema,
    jobs: z.array(jobSchema).min(1, 'at least one published job is required'),
    projects: z.array(projectSchema).min(1, 'at least one published project is required'),
    notes: z.array(watchNoteSchema),
  })
  .transform(({ siteSettings, homePage, jobs, projects, notes }) => ({
    site: siteSettings,
    hero: homePage.hero,
    sectionTitles: homePage.sections,
    skills: homePage.skills,
    contact: homePage.contact,
    jobs,
    projects,
    notes,
  }));

export type HomeContent = z.output<typeof homeContentSchema>;
export type SiteSettings = HomeContent['site'];
export type OwnerLinks = SiteSettings['links'];
export type Person = NonNullable<SiteSettings['person']>;
export type PersonLocation = Person['location'];
export type HeroContent = HomeContent['hero'];
export type SkillsContent = HomeContent['skills'];
export type ContactContent = HomeContent['contact'];
export type Job = HomeContent['jobs'][number];
export type Sector = NonNullable<Job['sector']>;
export type Project = HomeContent['projects'][number];
export type WatchNote = HomeContent['notes'][number];
