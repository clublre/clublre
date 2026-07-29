import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

/**
 * `app/icon.tsx` — Next 16 favicon route. Next picks this up
 * automatically (better than the legacy `public/favicon.ico`)
 * and serves a 32×32 PNG sized right for browser tabs + bookmarks.
 */
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

/**
 * Crop the actual LRE shield to a 32×32 favicon. Single-pass load
 * through Node `fs` reads the asset once per build (static route).
 */
export default async function Icon() {
  const logoData = await readFile(join(process.cwd(), 'public', 'logo2.jpeg'));
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
      {}
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
