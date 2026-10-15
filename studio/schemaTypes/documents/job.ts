import { defineArrayMember, defineField, defineType } from 'sanity';
import { CaseIcon } from '@sanity/icons/Case';
import { localizedValue } from 'portfolio-content-model';
import { optionalString } from '../guards';
import { technologiesField } from '../fields';
import { joinSubtitle, localizedFieldsOf, missingLocalesSubtitle } from '../validation/preview';
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
      name: 'summary',
      description: 'Optional one-line description of the company, shown under the role.',
      type: 'internationalizedArrayString',
      validation: requireLocales({ optional: true }),
    }),
    defineField({
      name: 'sector',
      description: 'Its name labels the card; its colour tints the card, the dot and the bullets.',
      type: 'reference',
      to: [{ type: 'sector' }],
      validation: (rule) => rule.required(),
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
          const startDate = optionalString(context.document?.startDate);
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
    technologiesField(),
  ],
  orderings: [
    {
      title: 'Start date, newest first',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      company: 'company',
      role: 'role',
      summary: 'summary',
      sector: 'sector.name',
      achievements: 'achievements',
      startDate: 'startDate',
    },
    prepare: ({ company, role, summary, sector, achievements, startDate }) => ({
      title: company,
      subtitle: joinSubtitle(
        missingLocalesSubtitle([
          role,
          { items: summary, optional: true },
          ...localizedFieldsOf(achievements, 'text'),
        ]),
        localizedValue(sector),
        localizedValue(role),
        optionalString(startDate),
      ),
    }),
  },
});
