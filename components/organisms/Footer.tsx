import NextLink from "next/link";
import {
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";

const year = new Date().getFullYear();

/**
 * Footer — global site footer with brand, links and contact info.
 */
export function Footer() {
  return (
    <footer className='border-t border-default-200 bg-surface-muted'>
      <Container className='py-12 md:py-16'>
        <div className='grid gap-10 md:grid-cols-3'>
          {/* Brand */}
          <div>
            <div className='mb-4 flex items-center gap-2'>
              <Logo />
              <span className='font-bold text-foreground'>
                {siteConfig.name}
              </span>
            </div>
            <p className='max-w-xs text-sm text-default-600'>
              {siteConfig.description}. Más de 80 años formando deportistas y
              comunidad en Rosario.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className='mb-3 text-sm font-semibold uppercase tracking-wider text-default-700'>
              Navegación
            </h4>
            <ul className='space-y-2 text-sm'>
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <NextLink
                    className='text-default-600 transition-colors hover:text-primary'
                    href={item.href}>
                    {item.label}
                  </NextLink>
                </li>
              ))}
              <li>
                <NextLink
                  className='text-default-600 transition-colors hover:text-primary'
                  href='/blog'>
                  Blog
                </NextLink>
              </li>
              <li>
                <NextLink
                  className='text-default-600 transition-colors hover:text-primary'
                  href='/pricing'>
                  Cuotas
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='mb-3 text-sm font-semibold uppercase tracking-wider text-default-700'>
              Contacto
            </h4>
            <ul className='space-y-2 text-sm text-default-600'>
              <li className='flex items-start gap-2'>
                <FaMapMarkerAlt className='mt-0.5 size-4 shrink-0 text-primary' />
                <span>Av. Pellegrini 1500, Rosario, Santa Fe</span>
              </li>
              <li className='flex items-center gap-2'>
                <FaPhone className='size-4 shrink-0 text-primary' />
                <span>+54 341 555 0000</span>
              </li>
              <li className='flex items-center gap-2'>
                <FaEnvelope className='size-4 shrink-0 text-primary' />
                <span>info@clublre.com.ar</span>
              </li>
              <li className='flex items-center gap-2 pt-2'>
                <a
                  aria-label='Instagram'
                  className='text-default-600 transition-colors hover:text-primary'
                  href={siteConfig.links.instagram}
                  rel='noopener noreferrer'
                  target='_blank'>
                  <FaInstagram className='size-5' />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-10 flex flex-col items-start justify-between gap-4 border-t border-default-200 pt-6 text-xs text-default-500 md:flex-row md:items-center'>
          <p>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p>Hecho con ♥ en Rosario.</p>
        </div>
      </Container>
    </footer>
  );
}
