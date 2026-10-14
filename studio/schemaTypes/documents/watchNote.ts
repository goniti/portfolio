import { defineArrayMember, defineField, defineType } from 'sanity';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { NOTE_CATEGORIES } from '../categories';
import { localizedValue } from '../validation/localeProblems';
import { joinSubtitle, localizedFieldsOf, missingLocalesSubtitle } from '../validation/preview';
import { requireLocales } from '../validation/requireLocales';

/** A tech-watch note (sorted by publication date, newest first). */
export const watchNote = defineType({
  name: 'watchNote',
  title: 'Watch note',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: requireLocales(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      description: 'Only the month and year are shown.',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: NOTE_CATEGORIES, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readingMinutes',
      title: 'Reading time (minutes)',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'excerpt',
      type: 'internationalizedArrayText',
      validation: requireLocales(),
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedParagraph' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'takeaways',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedLine' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      excerpt: 'excerpt',
      body: 'body',
      takeaways: 'takeaways',
      publishedAt: 'publishedAt',
      category: 'category',
    },
    prepare: ({ title, excerpt, body, takeaways, publishedAt, category }) => ({
      title: localizedValue(title) ?? '(untitled)',
      subtitle: joinSubtitle(
        missingLocalesSubtitle([
          title,
          excerpt,
          ...localizedFieldsOf(body, 'text'),
          ...localizedFieldsOf(takeaways, 'text'),
        ]),
        category as string | undefined,
        publishedAt as string | undefined,
      ),
    }),
  },
});
