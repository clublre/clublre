import '@/styles/globals.css';
import { type Metadata, type Viewport } from 'next';

import { Providers } from './Providers';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';

/** Public origin used for absolute metadata URLs (OG, Twitter, canonical). */
const SITE_URL = 'https://clublre.com.ar';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'Club Los Rosarinos Estudiantil',
    'CLUB L.R.E',
    'club deportivo Rosario',
    'fútbol',
    'básquet',
    'natación',
    'tenis',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: SITE_URL,
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/logo2.jpeg',
    apple: '/logo2.jpeg',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="es">
      <head />
      <body
        className={cn(
          'bg-background text-foreground min-h-screen font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          {/* Skip link — visually hidden until focused, then keyboard-only
              users can jump straight to <main> without tabbing through
              the navbar. */}
          <a
            className="focus-visible:bg-primary focus-visible:text-primary-foreground sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:rounded-md focus-visible:px-3 focus-visible:py-1.5 focus-visible:text-sm focus-visible:font-semibold"
            href="#main-content"
          >
            Saltar al contenido
          </a>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="grow" id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
