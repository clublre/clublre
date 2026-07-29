'use client';

import NextLink from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@heroui/react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Icons';
import { IconButton } from '@/components/atoms/IconButton';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { siteConfig } from '@/config/site';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  /**
   * Whether a nav item should be marked as the current page.
   * Exact match for routes; fragment URLs (/#section) are never
   * 'current' because the route is the same as the page they
   * appear on.
   */
  const isCurrent = (href: string) =>
    !href.includes("#") && pathname === href;

  // Stable id for aria-controls on the mobile menu disclosure. Using
  // useId would also work, but this keeps the navbar Server-Component
  // friendly (state lives in this "use client" module anyway).
  const MOBILE_MENU_ID = 'navbar-mobile-menu';

  return (
    <nav
      aria-label="Principal"
      className="border-default-200/50 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <NextLink
          aria-label={`Ir al inicio — ${siteConfig.name}`}
          className="flex items-center gap-2"
          href="/"
          onClick={() => setIsMenuOpen(false)}
        >
          <Logo />
        </NextLink>

        {/* Desktop nav */}
        <ul className="hidden gap-6 sm:flex">
          {siteConfig.navItems.map((item) => {
            const current = isCurrent(item.href);
            return (
              <li key={item.href}>
                <NextLink
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "text-foreground hover:text-primary transition-colors",
                    current && "text-primary font-medium",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </li>
            );
          })}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            aria-label="Instagram (se abre en una pestaña nueva)"
            href={siteConfig.links.instagram}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaInstagram className="text-default-500 size-6" />
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-3 sm:hidden">
          <Link
            aria-label="Instagram (se abre en una pestaña nueva)"
            href={siteConfig.links.instagram}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaInstagram className="text-default-500 size-5" />
          </Link>
          <ThemeToggle />
          <IconButton
            aria-controls={MOBILE_MENU_ID}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onPress={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? (
              <svg
                aria-hidden="true"
                fill="none"
                focusable="false"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                fill="none"
                focusable="false"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>

      {/* Mobile menu — controlled by the disclosure button above. */}
      {isMenuOpen ? (
        <div
          aria-label="Menú de navegación móvil"
          className="border-default-200/50 bg-background border-t sm:hidden"
          id={MOBILE_MENU_ID}
        >
          <ul className="container mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {siteConfig.navMenuItems.map((item) => (
              <li key={item.href}>
                <NextLink
                  className={cn(
                    'text-foreground block rounded-md px-3 py-2 text-base transition-colors',
                    'hover:bg-default-100',
                  )}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
};
