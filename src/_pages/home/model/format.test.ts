import { describe, expect, it } from 'vitest';
import { formatIndex } from './format';

describe('formatIndex', () => {
  it('pads to two digits, with an optional offset', () => {
    expect(formatIndex(0)).toBe('00');
    expect(formatIndex(0, 1)).toBe('01');
    expect(formatIndex(11)).toBe('11');
  });
});
