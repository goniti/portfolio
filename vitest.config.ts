import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // `pnpm test` runs `unit` (fast, jsdom); `pnpm test:storybook` runs `storybook` (a browser).
    projects: [
      {
        oxc: { jsx: { runtime: 'automatic' } },
        // `@/…` imports, resolved from tsconfig.json paths.
        resolve: { tsconfigPaths: true },
        test: {
          name: 'unit',
          environment: 'jsdom',
          // `studio/`: the Studio's validation helpers (pure functions, no Studio runtime).
          // `packages/`: the shared content model (ADR-004).
          include: ['{app,src,studio,packages}/**/*.test.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        // Renders every story (`.storybook/main.ts`) in Chromium, through Playwright, and runs its
        // play function and the accessibility checks (`a11y.test` in `.storybook/preview.ts`).
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}', 'packages/*/src/**/*.ts'],
      exclude: [
        // Tests, stories, type declarations and entry points.
        '**/*.{test,spec,stories}.{ts,tsx}',
        '**/*.d.ts',
        'app/layout.tsx',
        'app/fonts/index.ts',
      ],
      // Below these thresholds the `coverage` script (run by CI) fails.
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
