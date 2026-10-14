import type { NextConfig } from 'next';
import { loadEnv } from './src/shared/config/server';

// Fail fast: an invalid environment stops `next dev` / `next build` right away.
const env = loadEnv();
const basePath = env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages (ADR-003): `next build` writes `out/`, no server at runtime.
  output: 'export',
  // `index.html` per route folder, which Pages serves without rewrites.
  trailingSlash: true,
  // The Next image optimizer needs a server.
  images: { unoptimized: true },
  // Project page `goniti.github.io/portfolio`: set `NEXT_PUBLIC_BASE_PATH=/portfolio` at build.
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
