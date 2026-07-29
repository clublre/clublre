import type { MetadataRoute } from 'next';

import { posts } from '@/data/posts';

/**
 * Sitemap — Next.js generates /sitemap.xml from this file.
 *
 * Static routes are listed explicitly. Blog posts are pulled from the
 * data layer so adding a post in `data/posts.ts` is enough.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://clublre.com.ar';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  const blogPosts: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogPosts];
}
