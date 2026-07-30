import type { Route } from 'next';

import { type posts } from '@/data/posts';

/**
 * Typed route helpers — single source of truth for every internal URL
 * the app navigates to. Centralising them here kills the `as Route`
 * casts that were scattered across pages/components, and lets the
 * TypeScript compiler validate the pattern instead of trusting the
 * author to spell `/blog/[slug]` right.
 *
 * Each helper returns a `Route` so `<NextLink href={...}>` and
 * `redirect(...)` accept it without further casts.
 *
 * Add new routes here as the app grows; never inline a path string.
 */

/** Union of every existing blog post slug — derived from the data
 *  layer so adding a post automatically widens the accepted set. */
export type PostSlug = (typeof posts)[number]['slug'];

export const routes = {
  home: '/' as Route,
  about: '/about' as Route,
  blog: '/blog' as Route,
  pricing: '/pricing' as Route,
  blogPost: (slug: PostSlug): Route => `/blog/${slug}` as Route,
} as const;
