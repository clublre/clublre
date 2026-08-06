import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

// Apple touch icon 180×180 — iOS Safari home-screen y share-sheets (iMessage/Slack iOS).

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export const runtime = 'nodejs';

export default async function AppleIcon() {
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
      <img
        alt="CLUB L.R.E"
        height={180}
        src={logoSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        width={180}
      />
    </div>,
    { ...size },
  );
}
