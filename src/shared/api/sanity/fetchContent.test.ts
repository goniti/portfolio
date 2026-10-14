import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { defaultFallbackPolicy, fetchContent, parseContent } from './fetchContent';
import { localizedString } from './localized';
import { ContentError } from './report';

const schema = z.object({
  settings: z.object({ _id: z.string(), _type: z.string(), title: localizedString() }),
  projects: z
    .array(
      z.object({
        _id: z.string(),
        _type: z.string(),
        title: localizedString(),
        achievements: z.array(z.object({ text: localizedString() })),
      }),
    )
    .min(1, 'at least one published project is required'),
});

const en = (value: string) => ({ _key: 'en', language: 'en', value });
const fr = (value: string) => ({ _key: 'fr', language: 'fr', value });

function content(overrides: { projectTitle?: unknown[]; achievement?: unknown[] } = {}) {
  return {
    settings: { _id: 'siteSettings', _type: 'siteSettings', title: [en('Hi'), fr('Salut')] },
    projects: [
      {
        _id: 'project-meeple',
        _type: 'project',
        title: overrides.projectTitle ?? [en('Meeple'), fr('Meeple')],
        achievements: [{ text: overrides.achievement ?? [en('Shipped'), fr('Livré')] }],
      },
    ],
  };
}

function problemsOf(run: () => unknown): readonly string[] {
  try {
    run();
  } catch (error) {
    if (error instanceof ContentError) return error.problems;
    throw error;
  }
  return [];
}

describe('parseContent', () => {
  it('returns the parsed content when it is complete', () => {
    expect(parseContent(content(), schema, 'fail').projects[0]?.title).toEqual({
      en: 'Meeple',
      fr: 'Meeple',
    });
  });

  it('reports each gap with its document, field and locale', () => {
    const problems = problemsOf(() =>
      parseContent(
        content({ projectTitle: [en('Meeple')], achievement: [en(' '), fr('Livré')] }),
        schema,
        'fail',
      ),
    );
    expect(problems).toEqual([
      'project "project-meeple" › title › fr: missing translation',
      'project "project-meeple" › achievements[0] › text › en: empty translation',
    ]);
  });

  it('reports a missing document and an empty collection', () => {
    const problems = problemsOf(() =>
      parseContent({ settings: null, projects: [] }, schema, 'fail'),
    );
    expect(problems).toEqual([
      'settings: document is missing: publish it in the Studio',
      'projects: at least one published project is required',
    ]);
  });

  it('falls back to the other locale with a visible marker, and warns', () => {
    const warn = vi.fn();
    const parsed = parseContent(
      content({ projectTitle: [en('Meeple')] }),
      schema,
      'other-locale',
      warn,
    );
    expect(parsed.projects[0]?.title).toEqual({ en: 'Meeple', fr: '[missing fr] Meeple' });
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain('project "project-meeple" › title › fr');
  });

  it('still throws without any locale to fall back on', () => {
    expect(() =>
      parseContent(content({ projectTitle: [] }), schema, 'other-locale', vi.fn()),
    ).toThrow(ContentError);
  });

  it('still throws on a problem that is not a locale gap', () => {
    expect(() =>
      parseContent({ ...content(), projects: [] }, schema, 'other-locale', vi.fn()),
    ).toThrow(/at least one published project/);
  });
});

describe('defaultFallbackPolicy', () => {
  it('falls back in development only', () => {
    expect(defaultFallbackPolicy('development')).toBe('other-locale');
    expect(defaultFallbackPolicy('production')).toBe('fail');
    expect(defaultFallbackPolicy('test')).toBe('fail');
  });
});

describe('fetchContent', () => {
  it('fetches, then parses', async () => {
    const client = { fetch: vi.fn().mockResolvedValue(content()) };
    const parsed = await fetchContent({ query: '*', schema, client, fallback: 'fail' });
    expect(parsed.settings.title.fr).toBe('Salut');
    expect(client.fetch).toHaveBeenCalledWith('*', {});
  });

  it('fails when Sanity cannot be reached', async () => {
    const client = { fetch: vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND')) };
    await expect(fetchContent({ query: '*', schema, client })).rejects.toThrow(
      'Could not fetch the content from Sanity: getaddrinfo ENOTFOUND',
    );
  });
});
