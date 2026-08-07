'use client';
import type { FC } from 'react';

import NextLink from 'next/link';
import { useMemo } from 'react';
import {
  ArrowRight,
  Home,
  Info,
  Menu,
  Newspaper,
  Storefront,
} from '@/components/ui/Icons';
import { usePathname } from 'next/navigation';
import { Button, Drawer } from '@heroui/react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Icons';
import { IconButton } from '@/components/atoms/IconButton';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { SignInTrigger, UserMenu } from '@/components/molecules/UserMenu';
import { useAuthStore } from '@/stores/auth-store';
import { useUiStore } from '@/stores/ui-store';
import { siteConfig } from '@/config/site';
import { routes } from '@/lib/routes';

// Mapeo href → ícono. Module-level — desktop y drawer lo consultan sin re-render.
const NAV_ICONS = {
  '/': Home,
  '/about': Info,
  '/blog': Newspaper,
  '/marketplace': Storefront,
} as const satisfies Record<string, FC<{ className?: string }>>;

type NavHref = keyof typeof NAV_ICONS;

/** Nav principal — desktop: marca + pill + toggle; mobile: marca + Drawer.
 *  Estado de ruta activa expuesto con `aria-current="page"`. */
export const Navbar = () => {
  // UI store para el menú mobile — futuro command palette/shortcut dispara
  // el drawer sin prop-drilling.
  const isMenuOpen = useUiStore((s) => s.mobileMenuOpen);
  const openMobileMenu = useUiStore((s) => s.openMobileMenu);
  const closeMobileMenu = useUiStore((s) => s.closeMobileMenu);
  const session = useAuthStore((s) => s.session);
  const pathname = usePathname();

  // Items visibles según sesión — memberOnly solo para socios logueados.
  const visibleNavItems = useMemo(
    () =>
      siteConfig.navItems.filter(
        (item) => !item.memberOnly || session !== null,
      ),
    [session],
  );
  const visibleNavMenuItems = useMemo(
    () =>
      siteConfig.navMenuItems.filter(
        (item) => !item.memberOnly || session !== null,
      ),
    [session],
  );

  // URLs con fragmento (`/#x`) nunca se marcan como current.
  const isCurrent = useMemo(
    () => (href: string) => !href.includes('#') && pathname === href,
    [pathname],
  );

  return (
    <>
      <nav
        aria-label="Principal"
        className={cn(
          'bg-background/70 supports-backdrop-filter:bg-background/60 border-b',
          'sticky top-0 z-40 w-full backdrop-blur-xl',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand */}
          <NextLink
            aria-label={`Ir al inicio — ${siteConfig.name}`}
            className="focus-visible:ring-primary focus-visible:ring-offset-background flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            href={routes.home}
            onClick={closeMobileMenu}
          >
            {/* priority + sizes para el LCP image en first paint */}
            <Logo priority size={50} sizes="50px" />
          </NextLink>

          {/* Nav desktop — pill style con bg-primary/10 en estado activo.
              Mantenido como `<ul>/<li>/<NextLink>` semántico para que
              los lectores de pantalla anuncien una lista de nav y
              `aria-current="page"` siga funcionando. */}
          <ul className="hidden items-center gap-1 sm:flex">
            {visibleNavItems.map((item) => {
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

          {/* Lado derecho desktop */}
          <div className="hidden items-center gap-1 sm:flex">
            {session ? <UserMenu /> : <SignInTrigger />}
            <ThemeToggle />
          </div>

          {/* Lado derecho mobile — avatar + hamburguesa. El ThemeToggle
              vive en el Drawer.Header, no hace falta duplicarlo acá. */}
          <div className="flex items-center gap-1 sm:hidden">
            {session ? <UserMenu /> : <SignInTrigger />}
            <IconButton
              aria-label="Abrir menú de navegación"
              size="md"
              variant="ghost"
              onPress={openMobileMenu}
            >
              <Menu aria-hidden="true" className="size-5" />
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Drawer mobile */}
      <Drawer.Backdrop
        isOpen={isMenuOpen}
        onOpenChange={(open) => {
          if (!open) closeMobileMenu();
        }}
      >
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full max-w-sm">
            <Drawer.Header className="flex flex-row items-center justify-between gap-2">
              <NextLink
                aria-label={`Ir al inicio — ${siteConfig.name}`}
                className="flex items-center gap-2.5 rounded-md"
                href={routes.home}
                onClick={closeMobileMenu}
              >
                <Logo size={50} />
              </NextLink>
              {/* Cluster derecho: theme toggle a la izquierda del close. */}
              <div className="flex items-center gap-1">
                <ThemeToggle />
                {/* Override del absolute positioning del slot para que
                    el close button participe del flex flow del header. */}
                <Drawer.CloseTrigger className="text-default-600 hover:text-foreground hover:bg-foreground/10 relative top-auto right-auto inline-flex size-9 items-center justify-center rounded-md transition-colors [&_svg]:size-4" />
              </div>
            </Drawer.Header>

            <Drawer.Body className="flex flex-col gap-4">
              <nav aria-label="Menú principal" className="flex-1">
                <ul className="flex flex-col gap-1">
                  {visibleNavMenuItems.map((item, i) => {
                    const Icon =
                      (item.href in NAV_ICONS
                        ? NAV_ICONS[item.href as NavHref]
                        : null) ?? Info;
                    const current = isCurrent(item.href);
                    return (
                      <li
                        key={item.href}
                        className="nav-item-anim"
                        style={
                          {
                            '--nav-delay': `${i * 40}ms`,
                          } as React.CSSProperties
                        }
                      >
                        <NextLink
                          aria-current={current ? 'page' : undefined}
                          className={cn(
                            'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                            current
                              ? 'bg-primary/10 text-primary'
                              : 'text-default-700 hover:bg-foreground/10 hover:text-foreground',
                          )}
                          href={item.href}
                          onClick={closeMobileMenu}
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
                        </NextLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* CTA primario anclado al fondo del body */}
              <div
                className="nav-item-anim mt-auto"
                style={
                  {
                    '--nav-delay': `${visibleNavMenuItems.length * 40}ms`,
                  } as React.CSSProperties
                }
              >
                <NextLink
                  className="block"
                  href={session ? routes.marketplaceNew : routes.login}
                  onClick={closeMobileMenu}
                >
                  <Button
                    className="w-full font-semibold"
                    size="md"
                    variant="primary"
                  >
                    {session ? 'Publicar' : 'Ingresá'}
                    <ArrowRight aria-hidden="true" className="ml-1 size-3.5" />
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
