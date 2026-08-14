// Resuelve la URL de imagen que muestra una card/listing-detail
// del marketplace. En modo maqueta (sin Supabase Storage) las
// imágenes reales no existen — preferimos el placeholder SVG
// antes que mandar al usuario a un 404.

import type { Listing } from '@/data/marketplace';

type Img = { id: string; alt: string; src: string };

const PLACEHOLDERS = {
  good: '/placeholders/listing-good.svg',
  service: '/placeholders/listing-service.svg',
} as const;

export function listingCoverImage(
  listing: Pick<Listing, 'images' | 'type'>,
): Img {
  const first = listing.images[0];
  // Filtro `src` falsy y casos donde `src` apunta a algo que
  // sabemos que no existe en maqueta (`/logo.png` se usaba como
  // placeholder improvisado — ver audit 2026-08-06).
  if (first && first.src && first.src !== '/logo.png') {
    return first;
  }
  return {
    id: `placeholder-${listing.type}`,
    alt: `Imagen placeholder para ${listing.type === 'service' ? 'servicio' : 'artículo'} entre socios`,
    src: PLACEHOLDERS[listing.type],
  };
}
