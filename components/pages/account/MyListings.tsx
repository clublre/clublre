'use client';

import { useMemo } from 'react';
import NextLink from 'next/link';
import { Chip, Button } from '@heroui/react';

import { CardClub } from '@/components/ui/CardClub';
import { routes } from '@/lib/routes';
import { type Listing, findCategory, categories } from '@/data/marketplace';
import { useMarketplaceStore } from '@/stores/marketplace-store';

const STATUS_LABEL: Record<Listing['status'], string> = {
  draft: 'Borrador',
  pending_review: 'En revisión',
  published: 'Publicada',
  reserved: 'Reservada',
  sold: 'Vendida',
  expired: 'Vencida',
  rejected: 'Rechazada',
  archived: 'Archivada',
};

const STATUS_COLOR: Record<
  Listing['status'],
  'default' | 'success' | 'warning' | 'danger' | 'accent'
> = {
  draft: 'default',
  pending_review: 'warning',
  published: 'success',
  reserved: 'accent',
  sold: 'default',
  expired: 'default',
  rejected: 'danger',
  archived: 'default',
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));

interface MyListingsProps {
  ownerId: string;
}

/** Lista de publicaciones del socio actual. */
export function MyListings({ ownerId }: MyListingsProps) {
  // Seleccionamos el array crudo (referencialmente estable cuando
  // no hay mutaciones) y filtramos con `useMemo`. `s.listingsByOwner()`
  // devuelve un array nuevo en cada render y rompe el snapshot
  // caching de `useSyncExternalStore` (loop infinito).
  const allListings = useMarketplaceStore((s) => s.listings);
  const listings = useMemo(
    () => allListings.filter((l) => l.ownerId === ownerId),
    [allListings, ownerId],
  );
  const setListingStatus = useMarketplaceStore((s) => s.setListingStatus);

  if (listings.length === 0) {
    return (
      <div className="bg-surface shadow-club rounded-2xl p-8 text-center">
        <p className="text-default-600 mb-4">
          Todavía no tenés publicaciones en Entre Socios.
        </p>
        <NextLink className="font-semibold" href={routes.marketplaceNew}>
          <Button className="font-semibold" size="md" variant="primary">
            Crear la primera
          </Button>
        </NextLink>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {listings.map((listing) => {
        const cat = findCategory(listing.categoryId, categories);
        return (
          <li key={listing.id}>
            <CardClub>
              <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                <Chip
                  className="tracking-wider uppercase"
                  color="accent"
                  size="sm"
                  variant="soft"
                >
                  {cat?.name ?? 'Sin categoría'}
                </Chip>
                <Chip
                  className="tracking-wider uppercase"
                  color={STATUS_COLOR[listing.status]}
                  size="sm"
                  variant="soft"
                >
                  {STATUS_LABEL[listing.status]}
                </Chip>
              </div>
              <h3 className="text-foreground line-clamp-2 text-lg font-semibold">
                {listing.title}
              </h3>
              <p className="text-default-600 mt-1 line-clamp-2 text-sm">
                {listing.description}
              </p>
              {listing.price !== null ? (
                <p className="text-foreground mt-2 text-base font-bold">
                  {formatPrice(listing.price)}
                </p>
              ) : null}
              <p className="text-default-500 mt-1 text-xs">
                {formatDate(listing.createdAt)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <NextLink
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                  href={routes.marketplaceItem(listing.id)}
                >
                  Ver
                </NextLink>
                <NextLink
                  className="text-default-600 hover:text-foreground text-sm font-medium"
                  href={routes.marketplaceEdit(listing.id)}
                >
                  Editar
                </NextLink>
                {listing.status === 'published' && (
                  <Button
                    size="sm"
                    variant="tertiary"
                    onPress={() =>
                      setListingStatus(
                        listing.id,
                        'archived',
                        ownerId,
                        'Archivada por el dueño',
                      )
                    }
                  >
                    Archivar
                  </Button>
                )}
                {listing.status === 'archived' && (
                  <Button
                    className="text-primary"
                    size="sm"
                    variant="tertiary"
                    onPress={() =>
                      setListingStatus(
                        listing.id,
                        'published',
                        ownerId,
                        'Reactivada por el dueño',
                      )
                    }
                  >
                    Reactivar
                  </Button>
                )}
              </div>
            </CardClub>
          </li>
        );
      })}
    </ul>
  );
}
