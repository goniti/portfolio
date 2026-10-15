import { describe, expect, it } from 'vitest';
import { childAt, readAt, replaceAt } from './path';

describe('readAt', () => {
  it('follows object keys and array indexes', () => {
    expect(readAt({ jobs: [{ role: 'Lead' }] }, ['jobs', 0, 'role'])).toBe('Lead');
    expect(readAt({ jobs: [] }, ['jobs', 0, 'role'])).toBeUndefined();
  });

  it('never reads a prototype member', () => {
    expect(childAt({}, '__proto__')).toBeUndefined();
    expect(readAt({}, ['constructor', 'prototype'])).toBeUndefined();
  });
});

describe('replaceAt', () => {
  it('sets the value when the parent exists, even for a missing key', () => {
    const data = { project: { title: 'Old' } };
    replaceAt(data, ['project', 'title'], 'New');
    replaceAt(data, ['project', 'description'], 'Added');
    replaceAt(data, ['missing', 'title'], 'Ignored');
    expect(data).toEqual({ project: { title: 'New', description: 'Added' } });
  });

  it('never writes to a prototype', () => {
    const data: Record<string, unknown> = JSON.parse('{"__proto__": {}}');
    replaceAt(data, ['__proto__', 'polluted'], true);
    replaceAt({}, ['constructor', 'prototype', 'polluted'], true);
    replaceAt({}, ['__proto__'], { polluted: true });
    expect(Object.prototype).not.toHaveProperty('polluted');
  });
});
