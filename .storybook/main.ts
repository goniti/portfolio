import type { StorybookConfig } from '@storybook/nextjs-vite';
import tailwindcss from '@tailwindcss/vite';

// Published under the site (`/portfolio/storybook/`): kept out of search results.
const NOINDEX = '<meta name="robots" content="noindex" />';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // The Next.js framework: `next/image`, `next/font` and the `NEXT_PUBLIC_*` variables work in
  // stories as in the app.
  framework: { name: '@storybook/nextjs-vite', options: {} },
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-vitest'],
  managerHead: (head = '') => `${head}${NOINDEX}`,
  previewHead: (head = '') => `${head}${NOINDEX}`,
  // Tailwind and the `@/…` alias.
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
    resolve: { ...viteConfig.resolve, tsconfigPaths: true },
  }),
};

export default config;
