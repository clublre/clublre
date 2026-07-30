import type { Route } from 'next';

export type SiteConfig = typeof siteConfig;

// Rutas internas usan `Route` de Next para que `typedRoutes` las valide.
// URLs externas (instagram, etc.) son strings planos.
type NavItem = { label: string; href: Route };

export const siteConfig = {
  name: 'CLUB L.R.E',
  description: 'Club Los Rosarinos Estudiantil',
  /** Origen público usado por metadata, sitemap, robots y JSON-LD.
   *  Mantenerlo en sync con el dominio canónico. */
  url: 'https://clublre.com.ar',
  navItems: [
    { label: 'Inicio', href: '/' },
    { label: 'El Club', href: '/about' },
    { label: 'Noticias', href: '/blog' },
    { label: 'Cuotas', href: '/pricing' },
  ] as ReadonlyArray<NavItem>,
  navMenuItems: [
    { label: 'Inicio', href: '/' },
    { label: 'El Club', href: '/about' },
    { label: 'Noticias', href: '/blog' },
    { label: 'Cuotas', href: '/pricing' },
  ] as ReadonlyArray<NavItem>,
  links: {
    instagram: 'https://www.instagram.com/clubestudiantilrosario/',
  },
} as const;
