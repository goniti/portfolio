import { defineArrayMember, defineField, defineType } from 'sanity';
import { CaseIcon } from '@sanity/icons/Case';
import { tintOptions } from '../tints';
import { localizedValue } from '../validation/localeProblems';
import { joinSubtitle, missingLocalesSubtitle } from '../validation/preview';
import { requireLocales } from '../validation/requireLocales';

/** A position of the career timeline (sorted by start date, most recent first). */
export const job = defineType({
  name: 'job',
  title: 'Job',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'company', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'role',
      type: 'internationalizedArrayString',
      validation: requireLocales(),
    }),
    defineField({
      name: 'startDate',
      description: 'Only the month and year are shown.',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      description: 'Leave empty for the current position ("Present").',
      type: 'date',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = (context.document as { startDate?: string } | undefined)?.startDate;
          return endDate && startDate && endDate < startDate
            ? 'The end date is before the start date'
            : true;
        }),
    }),
    defineField({
      name: 'achievements',
      type: 'array',
      of: [defineArrayMember({ type: 'localizedLine' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'technologies',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'tint',
      description: 'Colour of the timeline dot and bullets.',
      type: 'string',
      options: tintOptions(['indigo', 'cyan', 'violet']),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Start date, newest first',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { company: 'company', role: 'role', startDate: 'startDate' },
    prepare: ({ company, role, startDate }) => ({
      title: company,
      subtitle: joinSubtitle(
        missingLocalesSubtitle([role]),
        localizedValue(role),
        startDate as string | undefined,
      ),
    }),
  },
});
