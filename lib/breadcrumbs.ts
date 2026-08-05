import type { Route } from 'next';

import { type Role } from '@/data/marketplace';

/** Item del breadcrumb. El último (current) no tiene href. */
export interface BreadcrumbItem {
  label: string;
  href?: Route;
  /** Si se setea, sólo se muestra al usuario cuyo role esté en la lista.
   *  Sin `visibleTo`, el item es visible para cualquier logged-in. */
  visibleTo?: ReadonlyArray<Role>;
}

interface RouteMap {
  /** Regex contra `pathname`. La primera match gana. */
  pattern: RegExp;
  /** Construye los crumbs. Recibe el match array. */
  build: (match: RegExpMatchArray) => BreadcrumbItem[];
}

/** Páginas "generales" donde el breadcrumb no tiene valor — el usuario
 *  ya está en la raíz de una sección (home, about, blog index, blog
 *  post, marketplace index). El breadcrumb sólo ayuda en páginas
 *  internas (cuenta, marketplace/[id], admin/*) donde el usuario
 *  necesita volver a un padre. */
const PUBLIC_PATHS: ReadonlyArray<RegExp> = [
  /^\/$/,
  /^\/about$/,
  /^\/blog$/,
  /^\/blog\/[^/]+$/,
  /^\/marketplace$/,
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((re) => re.test(pathname));
}

/** Tabla de rutas con sus crumbs. Cada patrón es testeado en orden.
 *  El primer match wins — los más específicos van primero. */
const ROUTES: ReadonlyArray<RouteMap> = [
  // ——— Cuenta ———
  {
    pattern: /^\/cuenta\/estado$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Mi cuenta', href: '/cuenta' },
      { label: 'Estado de solicitud' },
    ],
  },
  {
    pattern: /^\/cuenta$/,
    build: () => [{ label: 'Inicio', href: '/' }, { label: 'Mi cuenta' }],
  },

  // ——— Marketplace ———
  {
    pattern: /^\/marketplace\/publicar$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Entre Socios', href: '/marketplace' },
      { label: 'Nueva publicación' },
    ],
  },
  {
    pattern: /^\/marketplace\/([^/]+)\/editar$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Entre Socios', href: '/marketplace' },
      { label: 'Editar publicación' },
    ],
  },
  {
    pattern: /^\/marketplace\/([^/]+)$/,
    build: (m) => {
      const id = m[1] ?? '';
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Entre Socios', href: '/marketplace' },
        { label: id },
      ];
    },
  },

  // ——— Admin (sólo staff) ———
  {
    pattern: /^\/admin\/auditoria$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Panel', href: '/admin', visibleTo: ['admin', 'moderator'] },
      { label: 'Auditoría', visibleTo: ['admin', 'moderator'] },
    ],
  },
  {
    pattern: /^\/admin\/categorias$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Panel', href: '/admin', visibleTo: ['admin', 'moderator'] },
      { label: 'Categorías', visibleTo: ['admin', 'moderator'] },
    ],
  },
  {
    pattern: /^\/admin\/reportes$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Panel', href: '/admin', visibleTo: ['admin', 'moderator'] },
      { label: 'Reportes', visibleTo: ['admin', 'moderator'] },
    ],
  },
  {
    pattern: /^\/admin\/marketplace$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Panel', href: '/admin', visibleTo: ['admin', 'moderator'] },
      { label: 'Publicaciones', visibleTo: ['admin', 'moderator'] },
    ],
  },
  {
    pattern: /^\/admin\/usuarios$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Panel', href: '/admin', visibleTo: ['admin', 'moderator'] },
      { label: 'Socios', visibleTo: ['admin', 'moderator'] },
    ],
  },
  {
    pattern: /^\/admin$/,
    build: () => [
      { label: 'Inicio', href: '/' },
      { label: 'Panel', visibleTo: ['admin', 'moderator'] },
    ],
  },
];

/** Construye los crumbs para un pathname y role. Devuelve `[]` si
 *  la path es pública (no mostrar breadcrumb) o si no hay match.
 *  Filtra items cuyo `visibleTo` no incluya el role actual. */
export function getBreadcrumbs(
  pathname: string,
  role: Role | null,
): BreadcrumbItem[] {
  if (isPublicPath(pathname)) return [];

  for (const route of ROUTES) {
    const match = pathname.match(route.pattern);
    if (!match) continue;
    const items = route.build(match);
    if (!role) return items;
    return items.filter(
      (item) => !item.visibleTo || item.visibleTo.includes(role),
    );
  }
  return [];
}
