import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Dimensiones OG estándar — 1200×630.
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Alt text para screen readers y social previews.
export const alt =
  'Club Los Rosarinos Estudiantil — Club deportivo en Rosario, Santa Fe';

// Ruta OG file-based de Next 16 — static al build (sin params/cookies).
// Servimos la imagen PNG pre-computada (public/og.png) en lugar de
// renderizar via ImageResponse/Satori en cada build (que tiene
// limites de tamano y rompe con el logo actual).
// Para regenerar la imagen tras cambios de copy/logo: ver
// docs/RUNBOOK.md seccion "Regenerar OG image".

export default async function Image() {
  const ogData = await readFile(join(process.cwd(), 'public', 'og.png'));

  return new Response(ogData, {
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}
