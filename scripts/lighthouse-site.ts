/**
 * First step of `pnpm lighthouse`: builds the static export with the GitHub Pages base path and
 * mounts it at `.lighthouseci/site/portfolio`, the `staticDistDir` of `lighthouserc.json`, so
 * Lighthouse CI audits `/portfolio/` as deployed. `lhci autorun` then runs (mobile, warnings
 * only, reports in `lighthouse-report/`); it needs Chrome, set `CHROME_PATH` when it is not found.
 */
import { spawnSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
/** Same base path as the GitHub Pages project page (`deploy.yml`). */
const BASE_PATH = '/portfolio';
const SITE_ROOT = join(ROOT, '.lighthouseci', 'site');

const build = spawnSync('pnpm', ['build'], {
  cwd: ROOT,
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
if (build.status !== 0) process.exit(build.status ?? 1);

rmSync(SITE_ROOT, { recursive: true, force: true });
cpSync(join(ROOT, 'out'), join(SITE_ROOT, BASE_PATH), { recursive: true });
