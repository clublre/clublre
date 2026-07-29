import NextLink from 'next/link';
import { Button } from '@heroui/react';
import {
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowUp,
} from 'react-icons/fa';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Logo } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

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
    <footer className='border-default-200 bg-surface-muted border-t'>
      {/* CTA strip */}
      <div className='border-default-200 border-b'>
        <Container className='flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center md:py-12'>
          <div className='max-w-2xl'>
            <Eyebrow className='mb-2 block' tone='sky'>
              Sumate al club
            </Eyebrow>
            <h2 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
              Tres generaciones ya pasaron por acá.
            </h2>
            <p className='text-default-600 mt-2 text-base'>
              Conocé nuestras cuotas y empezá a disfrutar del club hoy mismo.
            </p>
          </div>
          <NextLink className='shrink-0' href='/pricing'>
            <Button size='lg' variant='primary'>
              Ver cuotas
              <span aria-hidden='true' className='ml-1'>
                →
              </span>
            </Button>
          </NextLink>
        </Container>
      </div>

      {/* Main grid */}
      <Container className='py-12 md:py-16'>
        <div className='grid gap-10 md:grid-cols-12'>
          {/* Brand — spans 5 cols on md+ */}
          <div className='md:col-span-5'>
            <NextLink
              aria-label={`Ir al inicio — ${siteConfig.name}`}
              className='mb-4 inline-flex items-center gap-2.5'
              href='/'
            >
              <Logo size={32} />
              <span className='font-bold tracking-tight text-foreground'>
                {siteConfig.name}
              </span>
            </NextLink>
            <p className='text-default-600 max-w-sm text-sm leading-relaxed'>
              {siteConfig.description}. Más de 80 años formando deportistas
              y comunidad en el corazón de Rosario.
            </p>

            {/* Social row */}
            <ul className='mt-6 flex items-center gap-2'>
              <li>
                <a
                  aria-label='Instagram (se abre en una pestaña nueva)'
                  className={cn(
                    'border-default-200 bg-background text-default-600 hover:border-primary hover:text-primary',
                    'inline-flex size-9 items-center justify-center rounded-full border transition-colors',
                  )}
                  href={siteConfig.links.instagram}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <FaInstagram aria-hidden='true' className='size-4' />
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation — 3 cols on md+ */}
          <nav
            aria-label='Pie de página — navegación'
            className='md:col-span-3'
          >
            <h2 className='sr-only'>Navegación</h2>
            <Eyebrow className='mb-3 block' tone='default'>
              Navegación
            </Eyebrow>
            <ul className='space-y-2.5 text-sm'>
              {siteConfig.navMenuItems.map((item) => (
                <li key={item.href}>
                  <NextLink
                    className={cn(
                      'text-default-600 hover:text-primary inline-flex items-center gap-1.5 transition-colors',
                      'before:bg-primary before:size-1 before:rounded-full before:opacity-0',
                      'hover:before:opacity-100 before:transition-opacity',
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact — 4 cols on md+ */}
          <div className='md:col-span-4'>
            <Eyebrow className='mb-3 block' tone='default'>
              Contacto
            </Eyebrow>
            <ul className='space-y-3 text-sm text-default-600'>
              <li className='flex items-start gap-2.5'>
                <FaMapMarkerAlt
                  aria-hidden='true'
                  className='text-primary mt-0.5 size-4 shrink-0'
                />
                <span>Av. Pellegrini 1500, Rosario, Santa Fe</span>
              </li>
              <li className='flex items-center gap-2.5'>
                <FaPhone
                  aria-hidden='true'
                  className='text-primary size-4 shrink-0'
                />
                <a
                  className='hover:text-primary transition-colors'
                  href='tel:+543415550000'
                >
                  +54 341 555 0000
                </a>
              </li>
              <li className='flex items-center gap-2.5'>
                <FaEnvelope
                  aria-hidden='true'
                  className='text-primary size-4 shrink-0'
                />
                <a
                  className='hover:text-primary transition-colors'
                  href='mailto:info@clublre.com.ar'
                >
                  info@clublre.com.ar
                </a>
              </li>
            </ul>

            {/* Hours mini-block */}
            <div className='border-default-200 mt-5 rounded-lg border bg-background/50 p-3'>
              <p className='text-default-500 text-xs font-semibold uppercase tracking-wider'>
                Atención
              </p>
              <p className='text-default-700 mt-1 text-sm'>
                Lun a vie · 9 a 21 h
              </p>
              <p className='text-default-700 text-sm'>
                Sáb · 9 a 19 h · Dom · 9 a 13 h
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className='border-default-200 border-t'>
        <Container className='flex flex-col items-start justify-between gap-3 py-6 text-xs text-default-500 sm:flex-row sm:items-center'>
          <p>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <div className='flex items-center gap-4'>
            <p className='hidden sm:block'>Hecho con ♥ en Rosario.</p>
            <a
              aria-label='Volver arriba'
              className={cn(
                'border-default-200 text-default-600 hover:border-primary hover:text-primary',
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
              )}
              href='#top'
            >
              <FaArrowUp aria-hidden='true' className='size-3' />
              Arriba
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
