import { defineArrayMember, defineField, defineType } from 'sanity';
import { RocketIcon } from '@sanity/icons/Rocket';
import { localizedValue, PROJECT_TINTS, type LocalizedItem } from 'portfolio-content-model';
import { PROJECT_CATEGORY_OPTIONS } from '../categories';
import { technologiesField, tintField } from '../fields';
import { joinSubtitle, missingLocalesSubtitle } from '../validation/preview';
import { requireLocales, validateLocales } from '../validation/requireLocales';

/** A project card (sorted by `sortOrder`, ascending). */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: requireLocales(),
    }),
    defineField({
      name: 'kind',
      description: 'Label on the screenshot, e.g. "Personal project · Full-Stack".',
      type: 'internationalizedArrayString',
      validation: requireLocales(),
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayText',
      validation: requireLocales(),
    }),
    defineField({
      name: 'image',
      title: 'Screenshot',
      description: 'Without one, the card shows the placeholder caption.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'internationalizedArrayString',
          validation: requireLocales(),
        }),
      ],
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder caption',
      description: 'Shown instead of the screenshot, e.g. "dashboard screenshot".',
      type: 'internationalizedArrayString',
      validation: (rule) =>
        rule
          .custom<LocalizedItem[]>((value, context) => {
            const hasImage = Boolean(context.document?.image);
            return validateLocales(value, { optional: hasImage });
          })
          .error(),
    }),
    defineField({
      name: 'categories',
      description: 'The project filters it appears under.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: PROJECT_CATEGORY_OPTIONS },
      validation: (rule) => rule.required().min(1).unique(),
    }),
    technologiesField(),
    tintField('Background tone behind the screenshot or placeholder.', PROJECT_TINTS),
    defineField({
      name: 'demoUrl',
      title: 'Live demo URL',
      description: 'Leave empty to hide the "Live Demo" button.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source code URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      description: 'Lower numbers come first.',
      type: 'number',
      validation: (rule) => rule.required().integer(),
    }),
  ],
  orderings: [
    { title: 'Sort order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      kind: 'kind',
      description: 'description',
      media: 'image',
      alt: 'image.alt',
      placeholder: 'placeholder',
      sortOrder: 'sortOrder',
    },
    prepare: ({ title, kind, description, media, alt, placeholder, sortOrder }) => ({
      title: localizedValue(title) ?? '(untitled)',
      subtitle: joinSubtitle(
        missingLocalesSubtitle([
          title,
          kind,
          description,
          { items: alt, optional: !media },
          { items: placeholder, optional: Boolean(media) },
        ]),
        `#${sortOrder ?? '?'}`,
        localizedValue(kind),
      ),
      media,
    }),
  },
});
