import NextLink from 'next/link';
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
 *   1. Main grid (2 cols on md+): brand + contact.
 *   2. Bottom bar: copyright + scroll-to-top.
 *
 * The earlier "Sumate al club" CTA strip was removed because it
 * duplicated the final CTA on the home page (same eyebrow, same
 * heading, same destination). The Footer's job is now to close the
 * page with contact info, not to relaunch the conversion message.
 *
 * Decorative icons carry `aria-hidden`; the parent <a> carries the
 * accessible label.
 */
export function Footer() {
  return (
    <footer className="bg-surface-muted">
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
