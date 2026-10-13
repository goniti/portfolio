// Feature-Sliced Design rules, checked by `pnpm lint:arch` (CI included).
// Rule reference: https://github.com/feature-sliced/steiger#rules
import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // Off in the recommended set, on here: imports inside a slice are relative,
      // imports between slices go through the `@/` alias (no index-file cycles).
      'fsd/import-locality': 'error',
      // A public API lists what it exposes: no `export * from`.
      'fsd/no-wildcard-exports': 'error',
    },
  },
  {
    // Next.js owns app/ and pages/: the FSD layers are prefixed (`_app`, `_pages`).
    // Steiger understands the prefix, except this rule, which reads it as a typo.
    files: ['./src/_app/**', './src/_pages/**'],
    rules: { 'fsd/typo-in-layer-name': 'off' },
  },
]);
