import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';
import { COUNTRY_CODE_PATTERN } from 'portfolio-content-model';
import { optionalString, stringField } from '../guards';
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
          const linkedinUrl = stringField(context.parent, 'linkedinUrl');
          return linkedinUrl && !value ? 'Required when the LinkedIn URL is set' : true;
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
      name: 'person',
      title: 'Person',
      description:
        'Who the site is about: the hero heading and the structured data for search engines. The owner name above is the alternate name; the GitHub and LinkedIn URLs are the other profiles.',
      type: 'object',
      group: 'identity',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'fullName',
          title: 'Full name',
          description: 'Opens the hero heading ("<full name> — <job title>").',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'jobTitle',
          title: 'Job title',
          type: 'internationalizedArrayString',
          validation: requireLocales(),
        }),
        defineField({
          name: 'location',
          description: 'Shown in the hero as "Lyon, France · Remote".',
          type: 'object',
          options: { collapsible: false },
          fields: [
            defineField({
              name: 'locality',
              description: 'City (not translated).',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'country',
              title: 'Country code',
              description:
                'ISO 3166-1 alpha-2 code, e.g. FR: the page names the country in each language.',
              type: 'string',
              validation: (rule) =>
                rule.required().regex(COUNTRY_CODE_PATTERN, { name: 'two-letter country code' }),
            }),
            defineField({
              name: 'remote',
              title: 'Works remotely',
              description: 'Adds "Remote" after the place.',
              type: 'boolean',
              initialValue: true,
              validation: (rule) => rule.required(),
            }),
          ],
          validation: (rule) => rule.required(),
        }),
      ],
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
      jobTitle: 'person.jobTitle',
      open: 'status.open',
      busy: 'status.busy',
      credits: 'credits',
      seoTitle: 'seo.title',
      seoDescription: 'seo.description',
    },
    prepare: ({ ownerName, jobTitle, open, busy, credits, seoTitle, seoDescription }) => ({
      title: 'Site settings',
      subtitle:
        missingLocalesSubtitle([
          jobTitle,
          open,
          busy,
          ...localizedFieldsOf(credits, 'text'),
          seoTitle,
          seoDescription,
        ]) ?? optionalString(ownerName),
    }),
  },
});
