import type { ComponentType } from 'react';
import { defineField, defineType } from 'sanity';
import { BlockquoteIcon } from '@sanity/icons/Blockquote';
import { TextIcon } from '@sanity/icons/Text';
import { localizedValue } from 'portfolio-content-model';
import { missingLocalesSubtitle } from '../validation/preview';
import { requireLocales } from '../validation/requireLocales';

interface LocalizedItemOptions {
  name: string;
  title: string;
  icon: ComponentType;
  textType: 'internationalizedArrayString' | 'internationalizedArrayText';
}

/** An object holding one `text` field with both locales, previewed by its text. */
function localizedItem({ name, title, icon, textType }: LocalizedItemOptions) {
  return defineType({
    name,
    title,
    type: 'object',
    icon,
    fields: [
      defineField({
        name: 'text',
        type: textType,
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
}

/**
 * A list item with both locales (achievements, takeaways, terminal lines…). Sanity arrays cannot
 * hold arrays, so each internationalized array is wrapped in an object: EN and FR lists can
 * never differ in length.
 */
export const localizedLine = localizedItem({
  name: 'localizedLine',
  title: 'Line',
  icon: TextIcon,
  textType: 'internationalizedArrayString',
});

/** A paragraph with both locales (note bodies). */
export const localizedParagraph = localizedItem({
  name: 'localizedParagraph',
  title: 'Paragraph',
  icon: BlockquoteIcon,
  textType: 'internationalizedArrayText',
});
