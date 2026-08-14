import NextLink from 'next/link';
import { Envelope, MapPin, Phone, PhoneMobile } from '@/components/ui/Icons';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Logo, InstagramIcon } from '@/components/ui/Icons';
import { siteConfig } from '@/config/site';
import { routes } from '@/lib/routes';
import { yearsSince } from '@/lib/utils';

const year = new Date().getFullYear();

// Helpers para hrefs — `wa.me` quiere solo dígitos, `tel:` quiere
// formato E.164 (+código de país).
const waDigits = (tel: string): string => tel.replace(/\D/g, '');

/** Footer global del sitio. Layout "hero + grid":
 *  1. Brand block full-width arriba (logo + descripción + CTA "Asociate")
 *  2. Grid de 2 columnas (Horarios + Contacto) en el centro
 *  3. Bottom bar con copyright
 *
 * Los datos vienen de `siteConfig` (single source of truth). */
export function Footer() {
  return (
    <footer className="bg-surface-muted border-default-200/15 border-t">
      <Container className="pt-10 pb-8 md:pt-14 md:pb-10">
        {/* ─── Brand block (full-width) ────────────────────────────── */}
        <div className="border-default-200/15 grid items-end gap-6 border-b pb-10 md:grid-cols-12 md:pb-12">
          <div className="md:col-span-8">
            <NextLink
              aria-label={`Ir al inicio — ${siteConfig.name}`}
              className="mb-4 inline-flex items-center gap-3"
              href={routes.home}
            >
              <Logo size={40} sizes="40px" />
              <span className="text-foreground text-lg font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </NextLink>
            <p className="text-default-600 max-w-2xl text-lg leading-relaxed">
              {siteConfig.description}. Más de{' '}
              {yearsSince(siteConfig.foundedYear)} años formando deportistas y
              comunidad en el corazón de Rosario.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            {/* CTA "Asociate al club" deshabilitado por ahora — apuntaba a /#cuotas (sección de pricing comentada en la home). */}
          </div>
        </div>

        {/* ─── Grid de 2 columnas (Horarios + Contacto) ────────────── */}
        <div className="grid gap-10 py-10 md:grid-cols-2 md:gap-12 md:py-12">
          {/* Horarios */}
          <div>
            <Eyebrow className="mb-4 block" tone="default">
              Horarios
            </Eyebrow>
            <dl className="text-default-600 space-y-2 text-sm">
              {siteConfig.hours.general.map((row) => (
                <div
                  key={row.days}
                  className="border-default-200/10 flex items-baseline justify-between gap-4 border-b pb-2 last:border-b-0"
                >
                  <dt className="text-foreground font-medium">{row.days}</dt>
                  <dd className="text-default-600 tabular-nums">{row.hours}</dd>
                </div>
              ))}
            </dl>
            <p className="text-default-500 mt-6 mb-2 text-xs font-semibold tracking-wider uppercase">
              Secretaría
            </p>
            <dl className="text-default-600 space-y-2 text-sm">
              {siteConfig.hours.secretaria.map((row) => (
                <div
                  key={row.days}
                  className="flex items-baseline justify-between gap-4"
                >
                  <dt className="text-foreground font-medium">{row.days}</dt>
                  <dd className="text-default-600 tabular-nums">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Contacto */}
          <div>
            <Eyebrow className="mb-4 block" tone="default">
              Contacto
            </Eyebrow>
            <ul className="text-foreground space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin
                  aria-hidden="true"
                  className="text-primary mt-0.5 size-4 shrink-0"
                />
                <a
                  aria-label="Cómo llegar en Google Maps"
                  className="link-underline hover:text-primary transition-colors"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.contact.address.mapsQuery)}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {siteConfig.contact.address.street},{' '}
                  {siteConfig.contact.address.postalCode}{' '}
                  {siteConfig.contact.address.city},{' '}
                  {siteConfig.contact.address.province}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
                <a
                  className="link-underline hover:text-primary transition-colors"
                  href={`tel:${siteConfig.contact.phone.tel}`}
                >
                  {siteConfig.contact.phone.display}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneMobile
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
                <a
                  aria-label="WhatsApp (se abre en una pestaña nueva)"
                  className="link-underline hover:text-primary transition-colors"
                  href={`https://wa.me/${waDigits(siteConfig.contact.whatsapp.tel)}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp: {siteConfig.contact.whatsapp.display}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Envelope
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
                <a
                  className="link-underline hover:text-primary transition-colors"
                  href={`mailto:${siteConfig.contact.email}`}
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="group flex items-center gap-2.5">
                <InstagramIcon
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
                <a
                  aria-label="Instagram (se abre en una pestaña nueva)"
                  className="link-underline hover:text-primary transition-colors"
                  href={siteConfig.links.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @clubestudiantilrosario
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Bottom bar ──────────────────────────────────────────── */}
        <div className="border-default-200/15 border-t pt-6">
          <Container className="text-default-500 flex flex-col items-start justify-between gap-3 text-xs sm:flex-row sm:items-center">
            <p>
              © {year} {siteConfig.name}. Todos los derechos reservados.
            </p>
            <p className="hidden sm:block">Hecho con ♥ en Rosario.</p>
          </Container>
        </div>
      </Container>
    </footer>
  );
}
