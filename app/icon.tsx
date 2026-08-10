import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Favicon route de Next 16 (32×32 PNG) — auto-tomado por Next.
// Servimos el logo directamente como PNG (sin ImageResponse) porque
// Satori/ImageResponse tiene limites de tamano para imagenes embebidas
// como data URI. Ver AUDIT-2026-08-06.md contexto.

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Single-pass por build (ruta static).

export default async function Icon() {
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
