import localFont from 'next/font/local';

// Meeple design system faces (variable woff2, latin subset), self-hosted. Shared by
// `app/layout.tsx` and the Storybook preview, so stories render with the site's fonts.
const dmSans = localFont({
  src: './DMSans-Variable.woff2',
  weight: '400 800',
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetBrainsMono = localFont({
  src: './JetBrainsMono-Variable.woff2',
  weight: '400 600',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

/** Classes defining `--font-dm-sans` and `--font-jetbrains-mono`, read by `globals.css`. */
export const FONT_VARIABLES: readonly string[] = [dmSans.variable, jetBrainsMono.variable];
