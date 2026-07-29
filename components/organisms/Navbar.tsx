'use client';

import NextLink from 'next/link';
import {
  FaHome,
  FaInfoCircle,
  FaNewspaper,
  FaTags,
  FaInstagram,
  FaBars,
  FaArrowRight,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, Drawer, Link } from '@heroui/react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Icons';
import { IconButton } from '@/components/atoms/IconButton';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { siteConfig } from '@/config/site';

/**
 * Icon for each nav href. Kept module-level (no hooks) so both the
 * desktop nav and the drawer can reference icons by lookup without
 * re-rendering the icon tree.
 */
const NAV_ICONS: Record<string, IconType> = {
  '/': FaHome,
  '/about': FaInfoCircle,
  '/blog': FaNewspaper,
  '/pricing': FaTags,
};

/**
 * Top-level site navigation.
 *
 * - Desktop (>= sm): brand + horizontal nav with icon + label and
 *   animated underline indicator + Instagram + theme toggle.
 * - Mobile (< sm): brand + hamburger that opens a HeroUI `Drawer`
 *   sliding from the right. The drawer carries three sections:
 *     1. Páginas — full nav list with active pill
 *     2. Contacto rápido — 3 tile-actions (call/email/map)
 *     3. CTA primario — "Hacete socio" pointing at /pricing
 *   plus social + theme in the footer.
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

  return (
    <>
      <nav
        aria-label="Principal"
        className={cn(
          'border-default-200/60 bg-background/70 supports-backdrop-filter:bg-background/60',
          'sticky top-0 z-40 w-full border-b backdrop-blur-xl',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand */}
          <NextLink
            aria-label={`Ir al inicio — ${siteConfig.name}`}
            className="focus-visible:ring-primary focus-visible:ring-offset-background flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            href="/"
            onClick={() => setIsMenuOpen(false)}
          >
            <Logo size={28} />
            <span className="text-foreground hidden text-sm font-bold tracking-tight sm:inline">
              {siteConfig.name}
            </span>
          </NextLink>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 sm:flex">
            {siteConfig.navItems.map((item) => {
              const Icon = NAV_ICONS[item.href];
              const current = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <NextLink
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'group relative inline-flex h-16 items-center gap-1.5 px-3 text-sm font-medium transition-colors',
                      current
                        ? 'text-primary'
                        : 'text-default-700 hover:text-foreground',
                    )}
                    href={item.href}
                  >
                    {Icon ? (
                      <Icon
                        aria-hidden="true"
                        className={cn(
                          'size-3.5 shrink-0 transition-colors',
                          current
                            ? 'text-primary'
                            : 'text-default-500 group-hover:text-foreground',
                        )}
                      />
                    ) : null}
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'bg-primary absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full transition-transform duration-300 ease-out',
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
          <div className="hidden items-center gap-1 sm:flex">
            <Link
              aria-label="Instagram (se abre en una pestaña nueva)"
              className="text-default-600 hover:text-primary rounded-md p-2 transition-colors"
              href={siteConfig.links.instagram}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaInstagram aria-hidden="true" className="size-4" />
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile right side — only the hamburger trigger. */}
          <div className="flex items-center sm:hidden">
            <IconButton
              aria-label="Abrir menú de navegación"
              size="md"
              variant="ghost"
              onPress={() => setIsMenuOpen(true)}
            >
              <FaBars aria-hidden="true" className="size-5" />
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <Drawer.Backdrop isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full max-w-sm">
            <Drawer.Header className="flex flex-row items-center justify-between gap-2">
              <NextLink
                aria-label={`Ir al inicio — ${siteConfig.name}`}
                className="flex items-center gap-2.5 rounded-md"
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                <Logo size={28} />
                <span className="text-foreground text-sm font-bold tracking-tight">
                  {siteConfig.name}
                </span>
              </NextLink>
              {/* Right cluster: theme toggle to the left of close. */}
              <div className="flex items-center gap-1">
                <ThemeToggle />
                {/* Override the slot's absolute positioning so the close
                    button participates in the header's flex flow. */}
                <Drawer.CloseTrigger className="text-default-600 hover:text-foreground hover:bg-default-100 relative top-auto right-auto inline-flex size-9 items-center justify-center rounded-md transition-colors [&_svg]:size-4" />
              </div>
            </Drawer.Header>

            <Drawer.Body className="flex flex-col gap-4">
              <nav aria-label="Menú principal" className="flex-1">
                <ul className="flex flex-col gap-1">
                  {siteConfig.navMenuItems.map((item) => {
                    const Icon = NAV_ICONS[item.href] ?? FaInfoCircle;
                    const current = isCurrent(item.href);
                    return (
                      <li key={item.href}>
                        <NextLink
                          aria-current={current ? 'page' : undefined}
                          className={cn(
                            'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                            current
                              ? 'bg-primary/10 text-primary'
                              : 'text-default-700 hover:bg-default-100 hover:text-foreground',
                          )}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon
                            aria-hidden="true"
                            className={cn(
                              'size-4 shrink-0 transition-colors',
                              current
                                ? 'text-primary'
                                : 'text-default-500 group-hover:text-foreground',
                            )}
                          />
                          <span>{item.label}</span>
                          {current ? (
                            <span
                              aria-hidden="true"
                              className="text-primary-foreground bg-primary ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
                            >
                              Activa
                            </span>
                          ) : null}
                        </NextLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* CTA primario anclado al fondo del body */}
              <div className="mt-auto">
                <NextLink
                  className="block"
                  href="/pricing"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    className="w-full font-semibold"
                    size="md"
                    variant="primary"
                  >
                    Hacete socio
                    <FaArrowRight
                      aria-hidden="true"
                      className="ml-1 size-3.5"
                    />
                  </Button>
                </NextLink>
              </div>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
