import '@/styles/globals.css';
import { type Metadata, type Viewport } from 'next';

import { Providers } from './Providers';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';

/**
 * JSON-LD SportsClub payload for Google rich results.
 *
 * Sources verified via web search (2026-07-29):
 * - Address:  Iriondo 375, S2122 Rosario  (Unilocal + Apple Maps)
 * - Phone:    +54 341 435 1273            (Unilocal)
 * - Social:   @clubestudiantilrosario    (Instagram)
 *
 * The `@id` gives the entity a stable identifier so Google can
 * deduplicate the SportsClub across crawls (and link it to the
 * Knowledge Graph if the club ever gets one).
 *
 * Rendered into the document as `<script type="application/ld+json">`
 * below; `dangerouslySetInnerHTML` is safe here because the payload
 * is built in code (no untrusted input).
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@id': `${siteConfig.url}/#club`,
  '@type': 'SportsClub',
  name: siteConfig.name,
  alternateName: 'CLUB L.R.E',
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo2.jpeg`,
  description: siteConfig.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Iriondo 375',
    addressLocality: 'Rosario',
    addressRegion: 'Santa Fe',
    postalCode: 'S2122',
    addressCountry: 'AR',
  },
  telephone: '+54 341 435 1273',
  sameAs: [siteConfig.links.instagram],
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'CLUB L.R.E | Club deportivo en Rosario, Santa Fe',
    template: `%s - ${siteConfig.name}`,
  },
  description:
    'Club deportivo y social en Rosario con más de 80 años formando comunidad. Básquet, natación, gimnasia artística, vóley, tenis de mesa y karate para toda la familia.',
  applicationName: siteConfig.name,
  keywords: [
    'Club Los Rosarinos Estudiantil',
    'CLUB L.R.E',
    'club deportivo Rosario',
    'básquet',
    'natación',
    'gimnasia',
    'vóley',
    'tenis de mesa',
    'karate',
    'pileta',
    'cuotas',
    'asociarse',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: 'Club Los Rosarinos Estudiantil — Deportes en Rosario',
    description:
      'Más de 80 años formando comunidad en Rosario. Fútbol, básquet, pileta climatizada y más. ¡Asociate hoy!',
    url: siteConfig.url,
    locale: 'es_AR',
    // `app/opengraph-image.tsx` is auto-detected by Next 16 — we still
    // declare it explicitly here so the link is visible at a glance.
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club Los Rosarinos Estudiantil — Deportes en Rosario',
    description:
      'Más de 80 años formando comunidad en Rosario. Fútbol, básquet, pileta climatizada y más.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
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
    <html suppressHydrationWarning data-scroll-behavior="smooth" lang="es-AR">
      <head />
      <body
        className={cn(
          'bg-background text-foreground min-h-screen font-sans antialiased',
          fontSans.variable,
        )}
      >
        {/* JSON-LD for Google rich results — see `jsonLd` constant above.
            Inlined as a string because schema.org payloads are static
            and the source is code, not user input. */}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <Providers
          themeProps={{
            attribute: 'class',
            defaultTheme: 'system',
            enableSystem: true,
          }}
        >
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
