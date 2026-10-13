import type { NextConfig } from 'next';
import { loadEnv } from './src/shared/config';

// Fail fast: an invalid environment stops `next dev` / `next build` right away.
loadEnv();

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
