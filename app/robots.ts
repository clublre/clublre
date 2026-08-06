import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

// robots.txt generado en /robots.txt. Apunta al sitemap.
// Bloquea auth/cuenta/marketplace/admin — son contenido privado.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/login',
          '/registro',
          '/cuenta',
          '/marketplace',
          '/admin',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
