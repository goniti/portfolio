import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  // The app builds with Next.js: Storybook runs on Vite, with Tailwind and the `@/…` alias.
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
    resolve: { ...viteConfig.resolve, tsconfigPaths: true },
  }),
};

export default config;
