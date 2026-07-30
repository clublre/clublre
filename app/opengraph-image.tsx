import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

/** Dimensiones OG estándar — 1200×630 para OG/Twitter cards. */
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

/** Texto accesible para lectores de pantalla y previewers de plataforma. */
export const alt =
  'Club Los Rosarinos Estudiantil — Club deportivo en Rosario, Santa Fe';

/** Runtime Node.js explícito: Vercel defaultea a Edge para metadata
 *  routes, pero necesitamos `node:fs`/`node:path` para embeber el
 *  escudo como data URI. */
export const runtime = 'nodejs';

// `app/opengraph-image.tsx` — ruta OG file-based de Next.js 16.
// Static al build (sin params / cookies / runtime). Genera un PNG
// 1200×630 para Twitter, LinkedIn, Slack, WhatsApp, etc.
// El escudo se embebe como data URI para que Satori lo incluya
// inline sin un segundo round-trip HTTP del crawler social.

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public', 'logo2.jpeg'));
  const logoSrc = `data:image/jpeg;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
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
    </div>,
    { ...size },
  );
}
