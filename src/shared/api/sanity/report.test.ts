import { describe, expect, it } from 'vitest';
import { ContentError, formatProblemList } from './report';

describe('formatProblemList', () => {
  it('puts each problem on its own indented bullet line', () => {
    expect(formatProblemList(['a: missing', 'b: invalid'])).toBe('  - a: missing\n  - b: invalid');
  });

  it('is empty without problems', () => {
    expect(formatProblemList([])).toBe('');
  });
});

describe('ContentError', () => {
  it('appends the problem list to the summary', () => {
    expect(new ContentError('Invalid content:', ['a: missing']).message).toBe(
      'Invalid content:\n  - a: missing',
    );
  });

  it('keeps the summary alone without problems', () => {
    expect(new ContentError('Unreachable').message).toBe('Unreachable');
  });
});
