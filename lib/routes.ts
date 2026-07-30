// Helpers de rutas tipadas — single source of truth para todas las URLs
// internas. Centralizarlos acá mata los casts `as Route` esparcidos por
// páginas y componentes. Cada helper devuelve un `Route` listo para
// `<NextLink href={...}>` y `redirect(...)`.

import type { Route } from 'next';

import { type posts } from '@/data/posts';

/** Union de todos los slugs de posts existentes — derivado de la capa
 *  de datos, así agregar un post amplía automáticamente el set aceptado. */
export type PostSlug = (typeof posts)[number]['slug'];

export const routes = {
  home: '/' as Route,
  about: '/about' as Route,
  blog: '/blog' as Route,
  pricing: '/pricing' as Route,
  blogPost: (slug: PostSlug): Route => `/blog/${slug}` as Route,
} as const;
