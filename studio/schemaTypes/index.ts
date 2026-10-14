import { homePage } from './documents/homePage';
import { job } from './documents/job';
import { project } from './documents/project';
import { siteSettings } from './documents/siteSettings';
import { watchNote } from './documents/watchNote';
import { localizedLine, localizedParagraph } from './objects/localizedItems';

export const schemaTypes = [
  siteSettings,
  homePage,
  job,
  project,
  watchNote,
  localizedLine,
  localizedParagraph,
];

/** Documents with a fixed `_id`: one each, pinned at the top of the Structure. */
export const SINGLETON_TYPES = ['siteSettings', 'homePage'];
