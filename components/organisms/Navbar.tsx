'use client';

import NextLink from 'next/link';
import {
  FaHome,
  FaInfoCircle,
  FaFutbol,
  FaNewspaper,
  FaTags,
  FaInstagram,
  FaBars,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer, Link } from '@heroui/react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Icons';
import { IconButton } from '@/components/atoms/IconButton';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { siteConfig } from '@/config/site';

/**
 * Icon for each nav href. Kept module-level (no hooks) so the
 * drawer items can reference them by lookup without re-rendering
 * the icon tree.
 */
const NAV_ICONS: Record<string, IconType> = {
  '/': FaHome,
  '/about': FaInfoCircle,
  '/#actividades': FaFutbol,
  '/blog': FaNewspaper,
  '/pricing': FaTags,
};

/**
 * Top-level site navigation.
 *
 * - Desktop (>= sm): brand + horizontal nav with animated underline
 *   indicator + Instagram + theme toggle.
 * - Mobile (< sm): brand + hamburger that opens a HeroUI `Drawer`
 *   sliding from the right, with all nav items as tappable rows
 *   (icon + label + active dot) plus social + theme in the footer.
 *
 * Active-route state is exposed via `aria-current="page"` for
 * assistive tech, mirrored visually by the underline / pill style.
 */
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  /** Fragment-only URLs (`/#x`) are never marked current. */
  const isCurrent = useMemo(
    () => (href: string) => !href.includes('#') && pathname === href,
    [pathname],
  );

  const year = new Date().getFullYear();

  return (
    <>
      <nav
        aria-label='Principal'
        className={cn(
          'border-default-200/60 bg-background/70 supports-[backdrop-filter]:bg-background/60',
          'sticky top-0 z-40 w-full border-b backdrop-blur-xl',
        )}
      >
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6'>
          {/* Brand */}
          <NextLink
            aria-label={`Ir al inicio — ${siteConfig.name}`}
            className='flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            href='/'
            onClick={() => setIsMenuOpen(false)}
          >
            <Logo size={28} />
            <span className='hidden text-sm font-bold tracking-tight text-foreground sm:inline'>
              {siteConfig.name}
            </span>
          </NextLink>

          {/* Desktop nav */}
          <ul className='hidden items-center gap-1 sm:flex'>
            {siteConfig.navItems.map((item) => {
              const current = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <NextLink
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'group relative inline-flex h-16 items-center px-3 text-sm font-medium transition-colors',
                      current
                        ? 'text-primary'
                        : 'text-default-700 hover:text-foreground',
                    )}
                    href={item.href}
                  >
                    {item.label}
                    <span
                      aria-hidden='true'
                      className={cn(
                        'absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300 ease-out',
                        current
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </NextLink>
                </li>
              );
            })}
          </ul>

          {/* Desktop right side */}
          <div className='hidden items-center gap-1 sm:flex'>
            <Link
              aria-label='Instagram (se abre en una pestaña nueva)'
              className='text-default-600 hover:text-primary rounded-md p-2 transition-colors'
              href={siteConfig.links.instagram}
              rel='noopener noreferrer'
              target='_blank'
            >
              <FaInstagram aria-hidden='true' className='size-4' />
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile right side — only the hamburger trigger. */}
          <div className='flex items-center sm:hidden'>
            <IconButton
              aria-label='Abrir menú de navegación'
              size='md'
              variant='ghost'
              onPress={() => setIsMenuOpen(true)}
            >
              <FaBars aria-hidden='true' className='size-5' />
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <Drawer.Backdrop isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Drawer.Content placement='right'>
          <Drawer.Dialog className='w-full max-w-sm'>
            <Drawer.Header className='flex items-center justify-between border-b border-default-100'>
              <NextLink
                aria-label={`Ir al inicio — ${siteConfig.name}`}
                className='flex items-center gap-2.5 rounded-md'
                href='/'
                onClick={() => setIsMenuOpen(false)}
              >
                <Logo size={28} />
                <span className='text-sm font-bold tracking-tight text-foreground'>
                  {siteConfig.name}
                </span>
              </NextLink>
              <Drawer.CloseTrigger />
            </Drawer.Header>

            <Drawer.Body className='gap-2 p-3'>
              <nav aria-label='Menú principal'>
                <ul className='flex flex-col gap-1'>
                  {siteConfig.navMenuItems.map((item) => {
                    const Icon = NAV_ICONS[item.href] ?? FaInfoCircle;
                    const current = isCurrent(item.href);
                    return (
                      <li key={item.href}>
                        <NextLink
                          aria-current={current ? 'page' : undefined}
                          className={cn(
                            'group flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors',
                            current
                              ? 'bg-primary/10 text-primary'
                              : 'text-default-700 hover:bg-default-100 hover:text-foreground',
                          )}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon
                            aria-hidden='true'
                            className={cn(
                              'size-5 shrink-0 transition-colors',
                              current ? 'text-primary' : 'text-default-500',
                            )}
                          />
                          <span>{item.label}</span>
                          {current ? (
                            <span
                              aria-hidden='true'
                              className='ml-auto size-2 rounded-full bg-primary'
                            />
                          ) : null}
                        </NextLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </Drawer.Body>

            <Drawer.Footer className='flex flex-col gap-4 border-t border-default-100'>
              <div className='flex items-center justify-between gap-2'>
                <Link
                  aria-label='Instagram (se abre en una pestaña nueva)'
                  className='text-default-700 hover:text-primary flex items-center gap-2 rounded-md text-sm transition-colors'
                  href={siteConfig.links.instagram}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <FaInstagram aria-hidden='true' className='size-4' />
                  @clubestudiantilrosario
                </Link>
                <ThemeToggle />
              </div>
              <p className='text-default-500 text-center text-xs'>
                © {year} {siteConfig.name}. Rosario, Argentina.
              </p>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
