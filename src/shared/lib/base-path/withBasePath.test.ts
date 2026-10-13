import { describe, expect, it } from 'vitest';
import { withBasePath } from './withBasePath';

describe('withBasePath', () => {
  it('prefixes a root-relative URL with the base path', () => {
    expect(withBasePath('/resume.pdf', '/portfolio')).toBe('/portfolio/resume.pdf');
  });

  it('leaves the URL untouched without a base path', () => {
    expect(withBasePath('/resume.pdf', '')).toBe('/resume.pdf');
  });

  it.each(['https://cdn.sanity.io/x.png', '//cdn.example.com/x.png', 'x.png', '', '#contact'])(
    'leaves %j untouched',
    (url) => {
      expect(withBasePath(url, '/portfolio')).toBe(url);
    },
  );
});
