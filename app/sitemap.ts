import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { posts } from '@/data/posts';

/** Sitemap — Next.js genera `/sitemap.xml` desde este archivo.
 *  Las rutas estáticas se listan explícitas y los posts se pullan
 *  de la capa de datos para que alcanzante con agregar uno en
 *  `data/posts.ts`. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const blogPosts: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogPosts];
}
