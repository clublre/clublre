import '@/styles/globals.css';
// CSS pre-hidratación para `<phantom-ui loading>`: oculta el texto
// placeholder hasta que el Web Component mida el DOM y superponga
// los shimmer blocks.
import '@aejkatappaja/phantom-ui/ssr.css';
import { type Metadata, type Viewport } from 'next';

import { Providers } from './Providers';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { BackToTop } from '@/components/ui/BackToTop';

// Payload JSON-LD SportsClub para rich results de Google.
// El `@id` da una identidad estable para que Google deduplique
// la entidad entre crawls. `dangerouslySetInnerHTML` es seguro
// porque el payload se construye en código (sin input del usuario).
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
    // `app/opengraph-image.tsx` es auto-detectado por Next 16; lo
    // declaramos explícito para que el link sea visible a simple vista.
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
        {/* JSON-LD para Google rich results — ver constante `jsonLd` arriba. */}
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
          {/* Skip link — oculto visualmente hasta recibir focus, permite a
              usuarios de teclado saltar directo al `<main>` sin tabular
              por la navbar. */}
          <a
            className="focus-visible:bg-primary focus-visible:text-primary-foreground sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:rounded-md focus-visible:px-3 focus-visible:py-1.5 focus-visible:text-sm focus-visible:font-semibold"
            href="#main-content"
          >
            Saltar al contenido
          </a>

          {/* Ambient lighting por página se monta dentro de cada ruta
              vía `<AmbientBlobs preset="..." />` para que cada página
              elija su propia dirección de luz. */}

          <ScrollProgress />
          <BackToTop />
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
