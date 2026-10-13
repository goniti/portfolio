import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  // `@/…` imports, resolved from tsconfig.json paths.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    include: ['{app,src}/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
      exclude: [
        // Tests, stories, type declarations and entry points.
        '**/*.{test,spec,stories}.{ts,tsx}',
        '**/*.d.ts',
        'app/layout.tsx',
      ],
      // Below these thresholds the `coverage` script (run by CI) fails.
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
