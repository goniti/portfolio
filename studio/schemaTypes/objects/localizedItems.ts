import { defineField, defineType } from 'sanity';
import { BlockquoteIcon } from '@sanity/icons/Blockquote';
import { TextIcon } from '@sanity/icons/Text';
import { localizedValue } from '../validation/localeProblems';
import { missingLocalesSubtitle } from '../validation/preview';
import { requireLocales } from '../validation/requireLocales';

/**
 * A list item with both locales (achievements, takeaways, terminal lines…). Sanity arrays cannot
 * hold arrays, so each internationalized array is wrapped in an object: EN and FR lists can
 * never differ in length.
 */
export const localizedLine = defineType({
  name: 'localizedLine',
  title: 'Line',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'text',
      type: 'internationalizedArrayString',
      validation: requireLocales(),
    }),
  ],
  preview: {
    select: { text: 'text' },
    prepare: ({ text }) => ({
      title: localizedValue(text) ?? '(empty)',
      subtitle: missingLocalesSubtitle([text]),
    }),
  },
});

/** A paragraph with both locales (note bodies). */
export const localizedParagraph = defineType({
  name: 'localizedParagraph',
  title: 'Paragraph',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'text',
      type: 'internationalizedArrayText',
      validation: requireLocales(),
    }),
  ],
  preview: {
    select: { text: 'text' },
    prepare: ({ text }) => ({
      title: localizedValue(text) ?? '(empty)',
      subtitle: missingLocalesSubtitle([text]),
    }),
  },
});
