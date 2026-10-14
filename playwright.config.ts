import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

// Not 3000: `reuseExistingServer` would silently test a running `pnpm dev` instead of the export.
const port = 3100;
const baseURL = `http://localhost:${port}`;
/** GitHub Pages behavior: `index.html` per folder, `/route` redirects to `/route/`. */
const serveConfig = fileURLToPath(new URL('./e2e/serve.json', import.meta.url));

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // The tests run against the static export (ADR-003), as deployed: build `out/`, then serve it.
  webServer: {
    command: `pnpm build && pnpm exec serve out --listen ${port} --no-clipboard --no-request-logging --config "${serveConfig}"`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    // The build fetches the content from Sanity.
    timeout: 240_000,
    // Served at the domain root: a base path from the shell or `.env.local` would break every URL
    // (the process environment wins over `.env*` files).
    env: { NEXT_PUBLIC_BASE_PATH: '', NEXT_PUBLIC_SITE_URL: baseURL },
  },
});
