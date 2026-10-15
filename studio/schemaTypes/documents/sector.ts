import { defineField, defineType } from 'sanity';
import { TagIcon } from '@sanity/icons/Tag';
import { localizedValue, SECTOR_TINTS } from 'portfolio-content-model';
import { optionalString } from '../guards';
import { tintField } from '../fields';
import { joinSubtitle, missingLocalesSubtitle } from '../validation/preview';
import { requireLocales } from '../validation/requireLocales';

/** The industry sector of a job: its name labels the card, its tint colours it. */
export const sector = defineType({
  name: 'sector',
  title: 'Sector',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      description: 'Shown in capitals above the dates, e.g. "MedTech".',
      type: 'internationalizedArrayString',
      validation: requireLocales(),
    }),
    tintField('Colour of the label, the top line, the timeline dot and the bullets.', SECTOR_TINTS),
  ],
  preview: {
    select: { name: 'name', tint: 'tint' },
    prepare: ({ name, tint }) => ({
      title: localizedValue(name) ?? '(unnamed)',
      subtitle: joinSubtitle(missingLocalesSubtitle([name]), optionalString(tint)),
    }),
  },
});
