import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { cn } from 'goniui';
import { env } from '@/shared/config';
import { FONT_VARIABLES } from './fonts';
import './globals.css';

// Title and description come from each page (`app/page.tsx`).
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
};

export const viewport: Viewport = { colorScheme: 'dark light' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // Dark is the default theme; the theme and locale toggles update `class` and `lang` on the client.
    <html lang="en" className={cn('dark', ...FONT_VARIABLES)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
