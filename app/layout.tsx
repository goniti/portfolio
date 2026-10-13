import type { Metadata } from 'next';
import { env } from '@/shared/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: 'my-portfolio',
  description: 'I created this portfolio to showcase my projects, share my ongoing tech watch, and highlight my skill set. Download my CV directly from the site or use the contact section to drop a message—I’d love to connect!',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
