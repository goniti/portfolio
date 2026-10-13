import { vi } from 'vitest';

/** Stubs `window.matchMedia` (missing in jsdom): the listed queries match, the others do not. */
export function stubMatchMedia(matchingQueries: readonly string[] = []) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: matchingQueries.includes(query),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}
