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
