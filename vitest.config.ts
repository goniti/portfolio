import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  // `@/…` imports, resolved from tsconfig.json paths.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    // `studio/`: the Studio's validation helpers (pure functions, no Studio runtime).
    include: ['{app,src,studio}/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    // Public variables Next.js would inline at build time: the contact section shows its
    // "Book a call" tab only with a Calendly page.
    env: { NEXT_PUBLIC_CALENDLY_URL: 'https://calendly.com/portfolio/intro-call' },
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
