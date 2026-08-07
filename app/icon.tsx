import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

// Favicon route de Next 16 (32×32 PNG) — auto-tomado por Next.

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Single-pass por build (ruta static).

export default async function Icon() {
  const logoData = await readFile(join(process.cwd(), 'public', 'logo.png'));
  const logoSrc = `data:image/jpeg;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      <img
        alt="CLUB L.R.E"
        height={32}
        src={logoSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        width={32}
      />
    </div>,
    { ...size },
  );
}
