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
      // vercel.live needed for Next 16 dev-mode feedback widget; it's
      // already allowed in dev via the headers() dev-skip but adding
      // it here as a defence-in-depth (some browsers / proxies can
      // re-inject CSP headers after a redirect).
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
      // Vercel Live / Insights beacon + og.xyz type tooling.
      "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live wss://vercel.live",
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
    // Headers are NOT applied in `next dev`. Next binds to localhost
    // only and HMR + Vercel Live feedback + Next dev's liveness
    // probes need a permissive CSP that breaks the production values.
    // The `headers()` callback runs in `next build` only when
    // NODE_ENV=production, but we make the skip explicit here so
    // every contributor sees why.
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
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
    /**
     * Opt into the CSS View Transitions API for client-side
     * navigations between App Router routes. The browser will
     * cross-fade matched elements (those sharing a
     * `view-transition-name`) automatically. Fallback is an
     * instant cut in browsers without support (Safari < 18).
     */
    viewTransition: true,
  },
  /**
   * React 19 + Next 16: opt into the React Compiler for
   * automatic memoization. Stable in 19; safe for React Aria,
   * HeroUI and most client components since they already mark
   * pure renders. Drops most manual `useMemo` / `useCallback`
   * in the codebase (we have a few in Navbar and ThemeToggle
   * that can stay or be removed later).
   */
  reactCompiler: {
    target: '19',
  },
};

module.exports = nextConfig;
