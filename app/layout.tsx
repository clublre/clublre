import '@/styles/globals.css';
// CSS pre-hidratación: oculta el texto de `<phantom-ui loading>`
// hasta que el Web Component mida el DOM y superponga los shimmers.
import '@aejkatappaja/phantom-ui/ssr.css';
import { type Metadata, type Viewport } from 'next';

import { Providers } from './Providers';

import { cn, yearsSince } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { BackToTop } from '@/components/ui/BackToTop';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { AdminNavBar } from '@/components/layouts/AdminNavBar';
import { getCurrentMember } from '@/lib/supabase/get-member';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

// JSON-LD SportsClub — `@id` estable para que Google deduplique entre crawls.
// `dangerouslySetInnerHTML` seguro: el payload se construye en código (sin input del usuario).
const jsonLd = {
  '@context': 'https://schema.org',
  '@id': `${siteConfig.url}/#club`,
  '@type': 'SportsClub',
  name: siteConfig.name,
  alternateName: 'CLUB L.R.E',
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.contact.address.street,
    addressLocality: siteConfig.contact.address.city,
    addressRegion: siteConfig.contact.address.province,
    postalCode: siteConfig.contact.address.postalCode,
    addressCountry: siteConfig.contact.address.country,
  },
  // Teléfono fijo. WhatsApp va por separado en `contactPoint` para que
  // Google lo distinga y muestre el canal correcto en el panel.
  telephone: siteConfig.contact.phone.tel,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: siteConfig.contact.whatsapp.tel,
      contactOption: 'TollFree',
      areaServed: 'AR',
      availableLanguage: ['es-AR'],
    },
  ],
  sameAs: [siteConfig.links.instagram],
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'CLUB L.R.E | Club deportivo en Rosario, Santa Fe',
    template: `%s - ${siteConfig.name}`,
  },
  description: `Club deportivo y social en Rosario con más de ${yearsSince(siteConfig.foundedYear)} años formando comunidad. Básquet, natación, gimnasia artística, vóley, tenis de mesa y karate para toda la familia.`,
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
    description: `Más de ${yearsSince(siteConfig.foundedYear)} años formando comunidad en Rosario. Fútbol, básquet, pileta climatizada y más. ¡Asociate hoy!`,
    locale: 'es_AR',
    // app/opengraph-image.tsx es auto-detectado por Next 16 — lo declaramos
    // explícito para que sea visible a simple vista.
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club Los Rosarinos Estudiantil — Deportes en Rosario',
    description: `Más de ${yearsSince(siteConfig.foundedYear)} años formando comunidad en Rosario. Fútbol, básquet, pileta climatizada y más.`,
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cookie de Auth (si hay) para Navbar/UserMenu; si es null → maqueta en el cliente.
  const supabaseMember = await getCurrentMember();

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
            <Navbar supabaseMember={supabaseMember} />
            <Breadcrumb />
            <AdminNavBar />
            <main className="grow" id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
