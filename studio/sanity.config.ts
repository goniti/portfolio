import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { dataset, projectId } from './env';
import { schemaTypes, SINGLETON_TYPES } from './schemaTypes';
import { LOCALE_OPTIONS } from './schemaTypes/locales';
import { structure } from './structure';

/** Actions a singleton keeps: no duplicate, no delete (it must always exist). */
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'default',
  title: 'Portfolio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    // ADR-003: field-level localization, plugin v5+ (`language` field). Never enable
    // `buttonLocations: 'unstable__fieldAction'` (broken since plugin 4.0.4).
    internationalizedArray({
      languages: LOCALE_OPTIONS,
      defaultLanguages: LOCALE_OPTIONS.map(({ id }) => id),
      fieldTypes: ['string', 'text'],
      buttonAddAll: false,
      restoreOrder: false,
      languageDisplay: 'titleAndCode',
    }),
    visionTool({ defaultApiVersion: '2026-10-01' }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons are opened from the Structure only, never created from "New document".
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.includes(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType)
        ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
        : actions,
  },
});
