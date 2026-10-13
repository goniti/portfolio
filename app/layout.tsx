import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { cn } from 'goniui';
import { env } from '@/shared/config';
import './globals.css';

// Meeple design system faces (variable woff2, latin subset), self-hosted.
const dmSans = localFont({
  src: './fonts/DMSans-Variable.woff2',
  weight: '400 800',
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetBrainsMono = localFont({
  src: './fonts/JetBrainsMono-Variable.woff2',
  weight: '400 600',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// Title and description come from each page (`app/page.tsx`).
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
};

export const viewport: Viewport = { colorScheme: 'dark light' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // Dark is the default theme; the theme and locale toggles update `class` and `lang` on the client.
    <html
      lang="en"
      className={cn('dark', dmSans.variable, jetBrainsMono.variable)}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
