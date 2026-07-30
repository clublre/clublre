'use client';

import NextLink from 'next/link';
import {
  FaHome,
  FaInfoCircle,
  FaNewspaper,
  FaTags,
  FaBars,
  FaArrowRight,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, Drawer } from '@heroui/react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Icons';
import { IconButton } from '@/components/atoms/IconButton';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { siteConfig } from '@/config/site';
import { routes } from '@/lib/routes';

/**
 * Icon for each nav href. Kept module-level (no hooks) so both the
 * desktop nav and the drawer can reference icons by lookup without
 * re-rendering the icon tree.
 *
 * `as const` locks the keys to a literal union so lookup with
 * `noPropertyAccessFromIndexSignature: true` typechecks without a
 * cast and the fallback (`?? FaInfoCircle`) is reachable only
 * for entries TS doesn't know about at compile time.
 */
const NAV_ICONS = {
  '/': FaHome,
  '/about': FaInfoCircle,
  '/blog': FaNewspaper,
  '/pricing': FaTags,
} as const satisfies Record<string, IconType>;

type NavHref = keyof typeof NAV_ICONS;

/**
 * Top-level site navigation.
 *
 * - Desktop (>= sm): brand + horizontal pill-style nav with icon + label
 *   (bg-primary/10 active state + hover bg-foreground/10) + theme toggle.
 *   Instagram lives in the Footer (single source of truth for the social
 *   link) so we don't repeat it across the chrome.
 * - Mobile (< sm): brand + hamburger that opens a HeroUI `Drawer`
 *   sliding from the right. The drawer carries the nav list (with
 *   rounded-xl active pill + "Activa" badge for the current route)
 *   + a primary CTA "Hacete socio" pointing at /pricing, plus the
 *   theme toggle in the header.
 *
 * Active-route state is exposed via `aria-current="page"` for
 * assistive tech; mirrored visually by a sky-tinted pill on both
 * the desktop nav and the drawer.
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
            href={routes.home}
            onClick={() => setIsMenuOpen(false)}
          >
            {/* priority + sizes for the LCP image on first paint */}
            <Logo priority size={28} sizes="(max-width: 640px) 28px, 28px" />
            <span className="text-foreground hidden text-sm font-bold tracking-tight sm:inline">
              {siteConfig.name}
            </span>
          </NextLink>

          {/* Desktop nav — pill style with bg-primary/10 active state.
              Kept as a semantic <ul>/<li>/<NextLink> (vs HeroUI Tabs) so
              that screen readers announce a navigation list and
              `aria-current="page"` keeps working for the active route. */}
          <ul className="hidden items-center gap-1 sm:flex">
            {siteConfig.navItems.map((item) => {
              const Icon = NAV_ICONS[item.href as NavHref];
              const current = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <NextLink
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'group inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200',
                      'focus-visible:ring-primary focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      current
                        ? 'bg-primary/10 text-primary'
                        : 'text-default-600 hover:bg-foreground/10 hover:text-foreground',
                    )}
                    href={item.href}
                  >
                    {Icon ? (
                      <Icon
                        aria-hidden="true"
                        className={cn(
                          'size-4 shrink-0 transition-colors',
                          current
                            ? 'text-primary'
                            : 'text-default-400 group-hover:text-foreground',
                        )}
                      />
                    ) : null}
                    {item.label}
                  </NextLink>
                </li>
              );
            })}
          </ul>

          {/* Desktop right side */}
          <div className="hidden items-center gap-1 sm:flex">
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
                href={routes.home}
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
                <Drawer.CloseTrigger className="text-default-600 hover:text-foreground hover:bg-foreground/10 relative top-auto right-auto inline-flex size-9 items-center justify-center rounded-md transition-colors [&_svg]:size-4" />
              </div>
            </Drawer.Header>

            <Drawer.Body className="flex flex-col gap-4">
              <nav aria-label="Menú principal" className="flex-1">
                <ul className="flex flex-col gap-1">
                  {siteConfig.navMenuItems.map((item) => {
                    const Icon =
                      (item.href in NAV_ICONS
                        ? NAV_ICONS[item.href as NavHref]
                        : null) ?? FaInfoCircle;
                    const current = isCurrent(item.href);
                    return (
                      <li key={item.href}>
                        <NextLink
                          aria-current={current ? 'page' : undefined}
                          className={cn(
                            'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                            current
                              ? 'bg-primary/10 text-primary'
                              : 'text-default-700 hover:bg-foreground/10 hover:text-foreground',
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
                  href={routes.pricing}
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
