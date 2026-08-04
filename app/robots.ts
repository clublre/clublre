import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/** robots.txt — generado en `/robots.txt` por Next.js.
 *  Apunta al sitemap para que los crawlers descubran todas las
 *  rutas. Bloquea auth, cuenta, marketplace y admin: son contenido
 *  privado y no deben aparecer en motores de búsqueda. */
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
