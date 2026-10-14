import type { StructureResolver } from 'sanity/structure';
import { CogIcon } from '@sanity/icons/Cog';
import { HomeIcon } from '@sanity/icons/Home';

/** Singletons first (fixed `_id`), then the collections in page order. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Home page')
        .id('homePage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      S.documentTypeListItem('job').title('Jobs'),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('watchNote').title('Watch notes'),
    ]);
