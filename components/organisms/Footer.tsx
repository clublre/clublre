import NextLink from 'next/link';
import { ArrowUp, MapPin, Phone } from '@/components/ui/Icons';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Logo, InstagramIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { routes } from '@/lib/routes';

const year = new Date().getFullYear();

/** Footer global del sitio. Grid de 2 columnas (marca + contacto)
 *  y barra inferior con copyright + scroll-to-top. */
export function Footer() {
  return (
    <footer className="bg-surface-muted">
      <Container className="pt-6 pb-8 md:pt-10 md:pb-10">
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
                <MapPin
                  aria-hidden="true"
                  className="text-primary mt-0.5 size-4 shrink-0"
                />
                <span>Iriondo 375, S2122 Rosario, Santa Fe</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
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
                <InstagramIcon
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
              <ArrowUp aria-hidden="true" className="size-3" />
              Arriba
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
