import type { Localized } from '@/shared/lib/i18n';
import type { HomeContent } from '../../src/_pages/home/model/content';

/*
 * Maps the site's content fixture (domain shape, both locales) to Sanity documents with fixed
 * `_id`s and `_key`s, so the seed can run again and replace the same documents.
 */

type FieldKind = 'String' | 'Text';

/** Sanity reference to an uploaded asset, by `_id`. */
interface AssetRefs {
  avatar: string;
  screenshots: Record<string, string>;
}

/** An internationalized array (plugin v5 shape: `language` field, own `_key`). */
function localized(values: Localized<string>, kind: FieldKind = 'String') {
  return Object.entries(values).map(([language, value]) => ({
    _key: `i18n-${language}`,
    _type: `internationalizedArray${kind}Value`,
    language,
    value,
  }));
}

function lines(values: readonly Localized<string>[], prefix: string) {
  return values.map((value, index) => ({
    _key: `${prefix}-${index + 1}`,
    _type: 'localizedLine',
    text: localized(value),
  }));
}

function paragraphs(values: readonly Localized<string>[]) {
  return values.map((value, index) => ({
    _key: `paragraph-${index + 1}`,
    _type: 'localizedParagraph',
    text: localized(value, 'Text'),
  }));
}

function imageRef(assetId: string) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
}

function siteSettings({ site }: HomeContent, assets: AssetRefs) {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    ownerName: site.ownerName,
    avatar: imageRef(assets.avatar),
    email: site.links.email,
    githubUrl: site.links.github.url,
    githubHandle: site.links.github.handle,
    linkedinUrl: site.links.linkedin?.url,
    linkedinName: site.links.linkedin?.name,
    openToWork: site.openToWork,
    status: { open: localized(site.status.open), busy: localized(site.status.busy) },
    credits: lines(site.credits, 'credit'),
    seo: {
      title: localized(site.seo.title),
      description: localized(site.seo.description, 'Text'),
    },
  };
}

function homePage({ hero, sectionTitles, skills, contact }: HomeContent) {
  return {
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      badge: localized(hero.badge),
      titleStart: localized(hero.titleStart),
      titleHighlight: localized(hero.titleHighlight),
      titleEnd: localized(hero.titleEnd),
      lead: localized(hero.lead, 'Text'),
      terminalScript: lines(hero.terminalScript, 'terminal'),
      focus: localized(hero.focus),
    },
    sections: {
      experience: localized(sectionTitles.experience),
      skills: localized(sectionTitles.skills),
      projects: localized(sectionTitles.projects),
      watch: localized(sectionTitles.watch),
    },
    skills: {
      coreStack: skills.coreStack.map(({ _key, name, tint }) => ({
        _key,
        _type: 'coreTechnology',
        name,
        tint,
      })),
      backendStack: skills.backendStack,
      aiPractices: skills.aiPractices.map(({ _key, title, description }) => ({
        _key,
        _type: 'aiPractice',
        title: localized(title),
        description: localized(description),
      })),
      leadership: skills.leadership.map(({ _key, title, description, monogram }) => ({
        _key,
        _type: 'leadershipSkill',
        title: localized(title),
        description: localized(description),
        monogram,
      })),
    },
    contact: { title: localized(contact.title), lead: localized(contact.lead, 'Text') },
  };
}

function jobs({ jobs: items }: HomeContent) {
  return items.map((job) => ({
    _id: job.id,
    _type: 'job',
    company: job.company,
    role: localized(job.role),
    startDate: job.startDate,
    endDate: job.endDate ?? undefined,
    achievements: lines(job.achievements, 'achievement'),
    technologies: job.technologies,
    tint: job.tint,
  }));
}

/** Gap between two `sortOrder` values, so a project can be slotted in without renumbering. */
const SORT_ORDER_STEP = 10;

function projects({ projects: items }: HomeContent, assets: AssetRefs) {
  return items.map((project, index) => {
    const screenshot = assets.screenshots[project.id];
    return {
      _id: project.id,
      _type: 'project',
      title: localized(project.title),
      kind: localized(project.kind),
      description: localized(project.description, 'Text'),
      placeholder: project.placeholder ? localized(project.placeholder) : undefined,
      image:
        screenshot && project.image
          ? { ...imageRef(screenshot), alt: localized(project.image.alt) }
          : undefined,
      categories: project.categories,
      technologies: project.technologies,
      tint: project.tint,
      demoUrl: project.demoUrl ?? undefined,
      sourceUrl: project.sourceUrl,
      sortOrder: (index + 1) * SORT_ORDER_STEP,
    };
  });
}

function watchNotes({ notes }: HomeContent) {
  return notes.map((note) => ({
    _id: note.id,
    _type: 'watchNote',
    title: localized(note.title),
    publishedAt: note.publishedAt,
    category: note.category,
    readingMinutes: note.readingMinutes,
    excerpt: localized(note.excerpt, 'Text'),
    body: paragraphs(note.body),
    takeaways: lines(note.takeaways, 'takeaway'),
  }));
}

/** A document ready for `createOrReplace`. */
export interface SeedDocument {
  _id: string;
  _type: string;
  [field: string]: unknown;
}

/** Every document of the site. */
export function buildDocuments(content: HomeContent, assets: AssetRefs): SeedDocument[] {
  return [
    siteSettings(content, assets),
    homePage(content),
    ...jobs(content),
    ...projects(content, assets),
    ...watchNotes(content),
  ];
}
