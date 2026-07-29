import type { MetadataRoute } from 'next';

/**
 * robots.txt — generated at /robots.txt by Next.js.
 *
 * References the sitemap so crawlers can discover every route.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
    ],
    sitemap: 'https://clublre.com.ar/sitemap.xml',
    host: 'https://clublre.com.ar',
  };
}
