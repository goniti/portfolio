import { defineArrayMember, defineField } from 'sanity';
import type { Tint } from 'portfolio-content-model';
import { tintOptions } from './tints';

/** Technology tags of a job or a project: at least one, no duplicates. */
export function technologiesField() {
  return defineField({
    name: 'technologies',
    type: 'array',
    of: [defineArrayMember({ type: 'string' })],
    options: { layout: 'tags' },
    validation: (rule) => rule.required().min(1).unique(),
  });
}

/** The required tint of a card, picked among `allowed`. */
export function tintField(description: string, allowed: readonly Tint[]) {
  return defineField({
    name: 'tint',
    description,
    type: 'string',
    options: tintOptions(allowed),
    validation: (rule) => rule.required(),
  });
}
