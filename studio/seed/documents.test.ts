import { describe, expect, it } from 'vitest';
import { HOME_CONTENT_FIXTURE } from '../../src/_pages/home/model/content.fixture';
import { buildDocuments, seedDocumentIds } from './documents';

describe('seedDocumentIds', () => {
  it('lists the ids of exactly the documents the seed writes', () => {
    const documents = buildDocuments(HOME_CONTENT_FIXTURE, {
      avatar: 'image-avatar',
      screenshots: {},
    });
    expect(seedDocumentIds(HOME_CONTENT_FIXTURE)).toEqual(documents.map(({ _id }) => _id));
  });
});

describe('buildDocuments', () => {
  const assets = { avatar: 'image-avatar', screenshots: {} };

  it('stores the person without the fields derived from the owner name and profile URLs', () => {
    const [siteSettings] = buildDocuments(HOME_CONTENT_FIXTURE, assets);
    expect(siteSettings?.person).toEqual({
      fullName: 'Carlos Gonzalez Lo Vullo',
      jobTitle: [
        {
          _key: 'i18n-en',
          _type: 'internationalizedArrayStringValue',
          language: 'en',
          value: 'Lead Front-End Developer',
        },
        {
          _key: 'i18n-fr',
          _type: 'internationalizedArrayStringValue',
          language: 'fr',
          value: 'Lead Développeur Front-End',
        },
      ],
      location: { locality: 'Lyon', country: 'FR', remote: true },
    });
  });

  it('stores the SEO fields in both locales', () => {
    const [siteSettings] = buildDocuments(HOME_CONTENT_FIXTURE, assets);
    expect(siteSettings?.seo).toMatchObject({
      title: [
        { language: 'en', value: expect.stringContaining('Lead Front-End Developer') },
        { language: 'fr', value: expect.stringContaining('Lead Développeur Front-End') },
      ],
      description: [
        { language: 'en', value: expect.stringContaining('Lyon, France · Remote') },
        { language: 'fr', value: expect.stringContaining('Lyon, France · Télétravail') },
      ],
    });
  });
});
