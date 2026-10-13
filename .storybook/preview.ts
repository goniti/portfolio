import type { Preview } from '@storybook/react-vite';
// Tailwind, the goniui tokens and the app styles: stories render like the app.
import '../app/globals.css';

const preview: Preview = {
  // An autodocs page (props table + stories) for every component.
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // axe-core checks every story (Accessibility panel).
    a11y: { test: 'error' },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      // goniui switches every token with a `.dark` class on <html>.
      document.documentElement.classList.toggle('dark', context.globals.theme === 'dark');
      return Story();
    },
  ],
};

export default preview;
