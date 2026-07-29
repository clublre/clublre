import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

/**
 * Generated OG image dimensions — standard 1200×630 for OG/Twitter cards.
 */
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

/**
 * Accessibility text used by screen readers and platform previewers.
 */
export const alt =
  'Club Los Rosarinos Estudiantil — Club deportivo en Rosario, Santa Fe';

/**
 * Explicit Node.js runtime.
 *
 * Vercel defaults metadata routes to the Edge runtime, which lacks
 * `node:fs`/`node:path`. Since we read `public/logo2.jpeg` to embed
 * the shield as a data URI, we have to opt out of Edge and run this
 * route on Node.
 */
export const runtime = 'nodejs';

/**
 * `app/opengraph-image.tsx` — Next.js 16 file-based OG image route.
 *
 * Static at build time (no params / no cookies / no runtime needed),
 * prerendered to a PNG and linked automatically from `app/layout.tsx`'s
 * metadata.openGraph.images. Serves a 1200×630 banner for Twitter,
 * LinkedIn, Slack, WhatsApp, etc.
 *
 * The shield is loaded from `public/logo2.jpeg` and embedded as a
 * data URI so Satori (which powers `next/og`) can include it inline
 * — this avoids a second HTTP round-trip from the social crawler.
 */
export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), 'public', 'logo2.jpeg'),
  );
  const logoSrc = `data:image/jpeg;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 72px',
          background:
            'linear-gradient(135deg, #0a4dc9 0%, #062479 60%, #03154a 100%)',
          color: 'white',
          fontFamily: 'Inter, system-ui, sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}
        >
          <div
            style={{
              width: 56,
              height: 3,
              background: '#EEE457',
              borderRadius: 2,
            }}
          />
          Rosario · Santa Fe · Argentina
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1,
            marginTop: 32,
            maxWidth: 920,
          }}
        >
          Club Los Rosarinos Estudiantil
        </div>

        <div style={{ display: 'flex', flex: 1 }} />

        {/* Bottom row — tagline + shield */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 48,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              opacity: 0.95,
              lineHeight: 1.25,
              maxWidth: 720,
            }}
          >
            Deportes, recreación y vida social para toda la familia.
          </div>
          <img
            alt="Escudo LRE"
            height={220}
            src={logoSrc}
            style={{
              borderRadius: '50%',
              flexShrink: 0,
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            }}
            width={220}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
