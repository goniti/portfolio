import { describe, expect, it } from 'vitest';
import { localizedLine, localizedParagraph } from './localizedItems';

const item = (language: string, value: string) => ({ _key: `k-${language}`, language, value });

describe('localized items', () => {
  it('wrap one localized text field each', () => {
    expect(localizedLine).toMatchObject({
      name: 'localizedLine',
      type: 'object',
      fields: [{ name: 'text', type: 'internationalizedArrayString' }],
    });
    expect(localizedParagraph).toMatchObject({
      name: 'localizedParagraph',
      type: 'object',
      fields: [{ name: 'text', type: 'internationalizedArrayText' }],
    });
  });

  it('preview their text and the missing locales', () => {
    const prepare = localizedLine.preview?.prepare;
    expect(prepare?.({ text: [item('en', 'Shipped it')] })).toEqual({
      title: 'Shipped it',
      subtitle: 'Missing: fr',
    });
    expect(prepare?.({ text: undefined })).toEqual({
      title: '(empty)',
      subtitle: 'Missing: en, fr',
    });
  });
});
