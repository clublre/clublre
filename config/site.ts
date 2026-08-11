import type { Route } from 'next';

export type SiteConfig = typeof siteConfig;

// Rutas internas usan `Route` de Next para que `typedRoutes` las valide.
// URLs externas (instagram, etc.) son strings planos.
type NavItem = {
  label: string;
  href: Route; /** Solo visible para socios logueados. */
  memberOnly?: boolean;
};

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
    { label: 'Entre Socios', href: '/marketplace', memberOnly: true },
  ] as ReadonlyArray<NavItem>,
  navMenuItems: [
    { label: 'Inicio', href: '/' },
    { label: 'El Club', href: '/about' },
    { label: 'Noticias', href: '/blog' },
    { label: 'Entre Socios', href: '/marketplace', memberOnly: true },
  ] as ReadonlyArray<NavItem>,
  links: {
    instagram: 'https://www.instagram.com/clubestudiantilrosario/',
  },
  /** Datos de contacto — fuente única para Footer, JSON-LD y
   *  cualquier futuro copy que los necesite. Editar acá, no inline. */
  contact: {
    address: {
      street: 'Iriondo 375',
      postalCode: 'S2122',
      city: 'Rosario',
      province: 'Santa Fe',
      country: 'AR',
      // Para el link "Cómo llegar" en Google Maps.
      mapsQuery: 'Iriondo 375, Rosario, Santa Fe',
    },
    whatsapp: {
      // Formato local. Para el link `wa.me/` usamos solo dígitos.
      display: '3416 83-4193',
      tel: '+543416834193',
    },
    phone: {
      display: '(0341) 794-4319',
      tel: '+543417944319',
    },
    email: 'losrosarinosestudiantil@hotmail.com',
  },
  /** Horarios — fuente única para el footer y otros lugares
   *  que los necesiten (Google Maps, JSON-LD openingHours, etc.).
   *  Sin distinción invierno/verano por ahora — un solo set. */
  hours: {
    general: [
      { days: 'Lunes a Viernes', hours: '10:00 a 01:00 hs' },
      { days: 'Sábados', hours: '10:00 a 02:00 hs' },
      { days: 'Domingos', hours: '10:00 a 21:00 hs' },
    ],
    secretaria: [{ days: 'Lunes a Viernes', hours: '17:00 a 30:00 hs' }],
  },
  /** Fecha fundacional del club (post-fusión 1959). */
  foundedYear: 1959,
} as const;
