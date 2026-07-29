/**
 * Bundle analysis lives in `next experimental-analyze` (Turbopack
 * compatible) and is invoked by `npm run analyze`. Keeping it out
 * of the build path means zero overhead for normal CI / production.
 */

/**
 * Security headers — baseline. Tighten further if/when the site
 * starts handling auth, payments or third-party embeds.
 *
 * Notes:
 * - CSP allows self + the data: scheme (used by the OG image for
 *   the embedded base64 shield) plus jsDelivr (next/font)
 * - frame-ancestors 'none' blocks iframe embedding (defence vs
 *   clickjacking even more strictly than X-Frame-Options)
 * - Permissions-Policy locks down camera/mic/geolocation/payment
 *   APIs the site never needs
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
    ].join(', '),
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // next/og embeds the shield as a data: URI, HeroUI inline
      // styles, and next/font may fetch subsets from gstatic/jsdelivr.
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Vercel Live / Insights beacon + og.xyz type tooling.
      "connect-src 'self' https://vitals.vercel-insights.com",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  // reactCompiler: { target: '19' },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      '@heroui/react',
      '@heroui/styles',
      'react-icons',
      'react-icons/fa',
      'framer-motion',
    ],
  },
};

module.exports = nextConfig;
