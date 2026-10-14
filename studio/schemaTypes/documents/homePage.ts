import { defineArrayMember, defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons/Home';
import { localizedValue } from 'portfolio-content-model';
import { tintOptions } from '../tints';
import { localizedFieldsOf, missingLocalesSubtitle } from '../validation/preview';
import { requireLocales } from '../validation/requireLocales';

/** Lines of the hero terminal: their tones are fixed in code (`TERMINAL_SCRIPT_STYLE`). */
const TERMINAL_LINES = 8;

const localizedString = (name: string, title?: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'internationalizedArrayString',
    validation: requireLocales(),
  });

const localizedText = (name: string, title?: string) =>
  defineField({ name, title, type: 'internationalizedArrayText', validation: requireLocales() });

/** Wording of the home page sections (one document, fixed `_id`). */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'sections', title: 'Section titles' },
    { name: 'skills', title: 'Skills' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    defineField({
      name: 'hero',
      type: 'object',
      group: 'hero',
      options: { collapsible: false },
      validation: (rule) => rule.required(),
      fields: [
        localizedString('badge'),
        localizedString(
          'titleStart',
          'Title, start',
          'Before the highlighted part. Use non-breaking characters to keep words together.',
        ),
        localizedString('titleHighlight', 'Title, highlighted part'),
        defineField({
          name: 'titleEnd',
          title: 'Title, end',
          description: 'After the highlighted part (may be empty, but both languages must exist).',
          type: 'internationalizedArrayString',
          validation: requireLocales({ allowBlank: true }),
        }),
        localizedText('lead'),
        defineField({
          name: 'terminalScript',
          title: 'Terminal script',
          description: `Exactly ${TERMINAL_LINES} lines: command, output, command, output…`,
          type: 'array',
          of: [defineArrayMember({ type: 'localizedLine' })],
          validation: (rule) => rule.required().length(TERMINAL_LINES),
        }),
        localizedString('focus', 'Terminal "Focus" stat'),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Section titles',
      type: 'object',
      group: 'sections',
      options: { collapsible: false },
      validation: (rule) => rule.required(),
      fields: [
        localizedString('experience'),
        localizedString('skills'),
        localizedString('projects'),
        localizedString('watch', 'Tech watch'),
      ],
    }),
    defineField({
      name: 'skills',
      type: 'object',
      group: 'skills',
      options: { collapsible: false },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'coreStack',
          title: 'Core stack',
          type: 'array',
          validation: (rule) => rule.required().min(1),
          of: [
            defineArrayMember({
              name: 'coreTechnology',
              type: 'object',
              fields: [
                defineField({
                  name: 'name',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'tint',
                  type: 'string',
                  options: tintOptions(),
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: { select: { title: 'name', subtitle: 'tint' } },
            }),
          ],
        }),
        defineField({
          name: 'backendStack',
          title: 'Backend & architecture',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          validation: (rule) => rule.required().min(1).unique(),
        }),
        defineField({
          name: 'aiPractices',
          title: 'AI-driven practices',
          type: 'array',
          validation: (rule) => rule.required().min(1),
          of: [
            defineArrayMember({
              name: 'aiPractice',
              type: 'object',
              fields: [localizedString('title'), localizedString('description')],
              preview: {
                select: { title: 'title', description: 'description' },
                prepare: ({ title, description }) => ({
                  title: localizedValue(title),
                  subtitle: missingLocalesSubtitle([title, description]),
                }),
              },
            }),
          ],
        }),
        defineField({
          name: 'leadership',
          title: 'Methodologies & leadership',
          type: 'array',
          validation: (rule) => rule.required().min(1),
          of: [
            defineArrayMember({
              name: 'leadershipSkill',
              type: 'object',
              fields: [
                localizedString('title'),
                localizedString('description'),
                defineField({
                  name: 'monogram',
                  description: 'Two letters shown in the badge.',
                  type: 'string',
                  validation: (rule) => rule.required().max(3),
                }),
              ],
              preview: {
                select: { title: 'title', description: 'description', monogram: 'monogram' },
                prepare: ({ title, description, monogram }) => ({
                  title: localizedValue(title),
                  subtitle: missingLocalesSubtitle([title, description]) ?? monogram,
                }),
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'contact',
      type: 'object',
      group: 'contact',
      options: { collapsible: false },
      validation: (rule) => rule.required(),
      fields: [localizedString('title'), localizedText('lead')],
    }),
  ],
  preview: {
    select: {
      badge: 'hero.badge',
      titleStart: 'hero.titleStart',
      titleHighlight: 'hero.titleHighlight',
      titleEnd: 'hero.titleEnd',
      lead: 'hero.lead',
      terminalScript: 'hero.terminalScript',
      focus: 'hero.focus',
      experience: 'sections.experience',
      skills: 'sections.skills',
      projects: 'sections.projects',
      watch: 'sections.watch',
      aiPractices: 'skills.aiPractices',
      leadership: 'skills.leadership',
      contactTitle: 'contact.title',
      contactLead: 'contact.lead',
    },
    prepare: (selection) => ({
      title: 'Home page',
      subtitle: missingLocalesSubtitle([
        selection.badge,
        selection.titleStart,
        selection.titleHighlight,
        { items: selection.titleEnd, allowBlank: true },
        selection.lead,
        ...localizedFieldsOf(selection.terminalScript, 'text'),
        selection.focus,
        selection.experience,
        selection.skills,
        selection.projects,
        selection.watch,
        ...localizedFieldsOf(selection.aiPractices, 'title', 'description'),
        ...localizedFieldsOf(selection.leadership, 'title', 'description'),
        selection.contactTitle,
        selection.contactLead,
      ]),
    }),
  },
});
