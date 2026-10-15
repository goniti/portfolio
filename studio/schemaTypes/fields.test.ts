import { describe, expect, it } from 'vitest';
import { PROJECT_TINTS } from 'portfolio-content-model';
import { technologiesField, tintField } from './fields';

describe('technologiesField', () => {
  it('is a list of string tags', () => {
    const field = technologiesField();
    expect(field).toMatchObject({
      name: 'technologies',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    });
  });
});

describe('tintField', () => {
  it('offers only the allowed tints, as radio buttons', () => {
    const field = tintField('Colour of the dot.', PROJECT_TINTS);
    expect(field).toMatchObject({
      name: 'tint',
      type: 'string',
      description: 'Colour of the dot.',
    });
    expect(field.options).toEqual({
      list: PROJECT_TINTS.map((tint) => ({ title: tint, value: tint })),
      layout: 'radio',
    });
  });
});
