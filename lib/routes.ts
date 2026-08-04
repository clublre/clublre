// Helpers de rutas tipadas — single source of truth para todas las URLs
// internas. Centralizarlos acá mata los casts `as Route` esparcidos por
// páginas y componentes. Cada helper devuelve un `Route` listo para
// `<NextLink href={...}>` y `redirect(...)`.

import type { Route } from 'next';

import { type posts } from '@/data/posts';
import { type Member } from '@/data/marketplace';

/** Union de todos los slugs de posts existentes — derivado de la capa
 *  de datos, así agregar un post amplía automáticamente el set aceptado. */
export type PostSlug = (typeof posts)[number]['slug'];

/** Id de un miembro — string para que la maqueta no acople tipos. */
export type MemberId = Member['id'];

export const routes = {
  home: '/' as Route,
  homeCuotas: '/#cuotas' as Route,
  about: '/about' as Route,
  blog: '/blog' as Route,
  blogPost: (slug: PostSlug): Route => `/blog/${slug}` as Route,

  // Auth y cuenta
  login: '/login' as Route,
  registro: '/registro' as Route,
  account: '/cuenta' as Route,
  accountStatus: '/cuenta/estado' as Route,

  // Marketplace
  marketplace: '/marketplace' as Route,
  marketplaceNew: '/marketplace/publicar' as Route,
  marketplaceItem: (id: string): Route => `/marketplace/${id}` as Route,
  marketplaceEdit: (id: string): Route => `/marketplace/${id}/editar` as Route,

  // Admin
  admin: '/admin' as Route,
  adminUsers: '/admin/usuarios' as Route,
  adminMarketplace: '/admin/marketplace' as Route,
  adminReports: '/admin/reportes' as Route,
  adminCategories: '/admin/categorias' as Route,
  adminAudit: '/admin/auditoria' as Route,
} as const;
