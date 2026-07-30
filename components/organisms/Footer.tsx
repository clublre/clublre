import NextLink from 'next/link';
import { Button } from '@heroui/react';
import {
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaArrowUp,
} from 'react-icons/fa';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Logo } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { routes } from '@/lib/routes';

const year = new Date().getFullYear();

/**
 * Footer — global site footer.
 *
 * Layout (top → bottom):
 *   1. CTA strip: "Sumate al club" with a HeroUI primary button.
 *   2. Main grid (12 cols on md+): brand + nav + contact.
 *   3. Bottom bar: copyright + scroll-to-top.
 *
 * Decorative icons carry `aria-hidden`; the parent <a> carries the
 * accessible label.
 */
export function Footer() {
  return (
    <footer className="bg-surface-muted">
      {/* CTA strip */}
      <div>
        <Container className="flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center md:py-12">
          <div className="max-w-2xl">
            <Eyebrow className="mb-2 block" tone="sky">
              Sumate al club
            </Eyebrow>
            <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
              Tres generaciones ya pasaron por acá.
            </h2>
            <p className="text-default-600 mt-2 text-base">
              Conocé nuestras cuotas y empezá a disfrutar del club hoy mismo.
            </p>
          </div>
          <NextLink className="shrink-0" href={routes.pricing}>
            <Button size="lg" variant="primary">
              Ver cuotas
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </Button>
          </NextLink>
        </Container>
      </div>

      {/* Main grid — 2 columns: brand on the left, contact on the
          right. After dropping the Navegación column the 12-col grid
          was wasted specificity; a simple 2-col feels right and lets
          each block breathe. */}
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Brand */}
          <div>
            <NextLink
              aria-label={`Ir al inicio — ${siteConfig.name}`}
              className="mb-4 inline-flex items-center gap-2.5"
              href={routes.home}
            >
              <Logo size={32} sizes="32px" />
              <span className="text-foreground font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </NextLink>
            <p className="text-default-600 max-w-sm text-sm leading-relaxed">
              {siteConfig.description}. Más de 80 años formando deportistas y
              comunidad en el corazón de Rosario.
            </p>
          </div>

          {/* Contact */}
          <div>
            <Eyebrow className="mb-3 block" tone="default">
              Contacto
            </Eyebrow>
            <ul className="text-default-600 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt
                  aria-hidden="true"
                  className="text-primary mt-0.5 size-4 shrink-0"
                />
                <span>Iriondo 375, S2122 Rosario, Santa Fe</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FaPhone
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
                <a
                  className="hover:text-primary transition-colors"
                  href="tel:+543414351273"
                >
                  +54 341 435 1273
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaInstagram
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
                <a
                  aria-label="Instagram (se abre en una pestaña nueva)"
                  className="hover:text-primary transition-colors"
                  href={siteConfig.links.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @clubestudiantilrosario
                </a>
              </li>
            </ul>

            {/* Hours — placeholder until the club confirms */}
            <div className="bg-foreground/5 mt-5 rounded-lg p-3">
              <p className="text-default-500 text-xs font-semibold tracking-wider uppercase">
                Horarios a confirmar
              </p>
              <p className="text-default-600 mt-1 text-sm italic">
                Consultar por Instagram o Facebook
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div>
        <Container className="text-default-500 flex flex-col items-start justify-between gap-3 py-6 text-xs sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <p className="hidden sm:block">Hecho con ♥ en Rosario.</p>
            <a
              aria-label="Volver arriba"
              className={cn(
                'bg-foreground/5 text-default-600 hover:bg-foreground/10 hover:text-primary',
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors',
              )}
              href="#top"
            >
              <FaArrowUp aria-hidden="true" className="size-3" />
              Arriba
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
