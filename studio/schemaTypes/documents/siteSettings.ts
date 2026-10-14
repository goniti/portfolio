import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';
import { localizedFieldsOf, missingLocalesSubtitle } from '../validation/preview';
import { requireLocales } from '../validation/requireLocales';

/** Owner identity, links, availability, footer and SEO: one document (fixed `_id`). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'footer', title: 'Footer' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'ownerName',
      title: 'Owner name',
      description: 'Shown in the compact navigation bar.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'avatar',
      description: 'Round portrait of the navigation (decorative: the link has its own name).',
      type: 'image',
      group: 'identity',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      group: 'identity',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'githubHandle',
      title: 'GitHub handle',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      description: 'Leave empty to hide LinkedIn everywhere.',
      type: 'url',
      group: 'identity',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'linkedinName',
      title: 'LinkedIn display name',
      type: 'string',
      group: 'identity',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { linkedinUrl?: string } | undefined;
          return parent?.linkedinUrl && !value ? 'Required when the LinkedIn URL is set' : true;
        }),
    }),
    defineField({
      name: 'openToWork',
      title: 'Open to work',
      description: 'Shows the "open" footer status (with its pulse) instead of the "busy" one.',
      type: 'boolean',
      group: 'identity',
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Footer status',
      type: 'object',
      group: 'footer',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'open',
          type: 'internationalizedArrayString',
          validation: requireLocales(),
        }),
        defineField({
          name: 'busy',
          type: 'internationalizedArrayString',
          validation: requireLocales(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'credits',
      description: 'Footer credit lines, rotated on click.',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({ type: 'localizedLine' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      description: 'The <head> uses the English values (no per-locale URLs).',
      type: 'object',
      group: 'seo',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'title',
          type: 'internationalizedArrayString',
          validation: requireLocales(),
        }),
        defineField({
          name: 'description',
          type: 'internationalizedArrayText',
          validation: requireLocales(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      ownerName: 'ownerName',
      open: 'status.open',
      busy: 'status.busy',
      credits: 'credits',
      seoTitle: 'seo.title',
      seoDescription: 'seo.description',
    },
    prepare: ({ ownerName, open, busy, credits, seoTitle, seoDescription }) => ({
      title: 'Site settings',
      subtitle:
        missingLocalesSubtitle([
          open,
          busy,
          ...localizedFieldsOf(credits, 'text'),
          seoTitle,
          seoDescription,
        ]) ?? (ownerName as string),
    }),
  },
});
