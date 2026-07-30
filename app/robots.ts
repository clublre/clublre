import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

/**
 * robots.txt — generated at /robots.txt by Next.js.
 *
 * References the sitemap so crawlers can discover every route. The
 * host and sitemap URL both come from `siteConfig.url` so they
 * stay in sync with metadata + sitemap.ts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
