import type { Route } from 'next';

export type SiteConfig = typeof siteConfig;

/**
 * Internal routes use Next.js `Route` so `typedRoutes` accepts them.
 * External URLs (instagram, etc.) are plain strings.
 */
type NavItem = { label: string; href: Route };

export const siteConfig = {
  name: 'CLUB L.R.E',
  description: 'Club Los Rosarinos Estudiantil',
  /** Public origin used by metadata, sitemap, robots, and JSON-LD.
   *  Keep this in sync with the canonical domain — Next 16 will
   *  reject the build if `metadataBase` is unreachable in production. */
  url: 'https://clublre.com.ar',
  navItems: [
    { label: 'Inicio', href: '/' },
    { label: 'El Club', href: '/about' },
    { label: 'Cuotas', href: '/pricing' },
  ] as ReadonlyArray<NavItem>,
  navMenuItems: [
    { label: 'Inicio', href: '/' },
    { label: 'El Club', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Cuotas', href: '/pricing' },
  ] as ReadonlyArray<NavItem>,
  links: {
    instagram: 'https://www.instagram.com/clubestudiantilrosario/',
  },
} as const;
