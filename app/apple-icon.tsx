import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Apple touch icon 180×180 — iOS Safari home-screen y share-sheets (iMessage/Slack iOS).
// Servimos el logo directamente como PNG (sin ImageResponse) porque
// Satori/ImageResponse tiene limites de tamano para imagenes embebidas
// como data URI.

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export const runtime = 'nodejs';

export default async function AppleIcon() {
  const logoData = await readFile(
    join(process.cwd(), 'public', 'logo-512.png'),
  );

  return new Response(logoData, {
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}
