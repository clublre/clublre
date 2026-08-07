// Bundle analysis: `npm run analyze` (Turbopack-compatible).
// Fuera del path de build normal — cero overhead en CI/prod.

// Security headers baseline. CSP permite data: (escudo en OG image
// como base64) y vercel.live. frame-ancestors 'none' blinda iframes.
// Permissions-Policy cierra APIs que el sitio no usa. Endurecer
// cuando se sume auth real.
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
      // data: requerido por OG image (escudo en base64).
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline'", // HeroUI inline styles
      "font-src 'self' data:", // next/font subsets
      // vercel.live = Next 16 dev-mode feedback widget.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
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
  // reactCompiler: { target: '19' },  // listo en 19, lo dejamos comentado hasta sumar CI
  // Next 16 requiere `images.qualities` explícito — sino warning al build.
  // Tambien agregamos AVIF + WebP para servir el formato optimo al browser
  // segun Accept header. AVIF es ~30% mas chico que WebP en promedio.
  images: {
    qualities: [75],
    formats: ['image/avif', 'image/webp'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    // Headers solo en producción: en dev el CSP permisivo +
    // HMR + Vercel Live no funcionan con la CSP estricta.
    // El callback corre en `next build` con NODE_ENV=production,
    // pero dejamos el skip explícito para que se vea el porqué.
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
      // tree-shaking agresivo para HeroUI
      '@heroui/react',
      '@heroui/styles',
      'react-icons',
      'react-icons/fa',
    ],
  },
  // React Compiler 19 — memoización automática. Seguro con HeroUI/RAC.
  reactCompiler: { target: '19' },
};

module.exports = nextConfig;
