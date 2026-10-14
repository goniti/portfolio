import { mkdirSync, readlinkSync, rmSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const port = 3100;
const origin = `http://localhost:${port}`;
/** Same base path as the GitHub Pages project page (`deploy.yml`). */
const basePath = '/portfolio';
const siteURL = `${origin}${basePath}`;
// Trailing slash: specs navigate with relative URLs (`./`), resolved under the base path.
const baseURL = `${siteURL}/`;
/** GitHub Pages behavior: `index.html` per folder, `/route` redirects to `/route/`. */
const serveConfig = fileURLToPath(new URL('./e2e/serve.json', import.meta.url));
const exportDir = fileURLToPath(new URL('./out', import.meta.url));
/** Stands for the domain root: only `<root>/portfolio` (a link to `out/`) exists, like on Pages. */
const domainRoot = fileURLToPath(new URL('./node_modules/.cache/e2e-pages', import.meta.url));

function linkTarget(path: string): string | undefined {
  try {
    return readlinkSync(path);
  } catch {
    return undefined;
  }
}

/** Links `out/` as `<domainRoot>/portfolio`; idempotent, since every worker loads this config. */
function mountExportUnderBasePath(): void {
  const mountPoint = join(domainRoot, basePath);
  mkdirSync(domainRoot, { recursive: true });
  if (linkTarget(mountPoint) === exportDir) return;
  rmSync(mountPoint, { recursive: true, force: true });
  try {
    symlinkSync(exportDir, mountPoint, 'junction');
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error;
  }
}

mountExportUnderBasePath();

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
  // The tests run against the static export (ADR-003), as deployed: build `out/` with the base
  // path, then serve it under `/portfolio/`.
  webServer: {
    command: `pnpm build && pnpm exec serve "${domainRoot}" --listen ${port} --no-port-switching --no-clipboard --no-request-logging --config "${serveConfig}"`,
    // `port`, not `url`: a server already on the port fails the run before the build, whatever it
    // answers under the base path. Always a fresh build, never a stale server.
    port,
    reuseExistingServer: false,
    // The build fetches the content from Sanity.
    timeout: 240_000,
    // The process environment wins over `.env.local`. Calendly: a fixture page, so the "Book a
    // call" tab exists whatever the local or CI settings; every request to it is stubbed.
    env: {
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_PUBLIC_SITE_URL: siteURL,
      NEXT_PUBLIC_CALENDLY_URL: 'https://calendly.com/e2e-fixture/30min',
    },
  },
});
