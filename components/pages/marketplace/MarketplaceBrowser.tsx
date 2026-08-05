'use client';

// Browser del marketplace — client component que combina los
// filtros, el listado y los vacíos. La data vive en `useMarketplaceStore`.

import { useMemo, useState } from 'react';

import {
  MarketplaceFilters,
  type MarketplaceFilterState,
} from '@/components/pages/marketplace/MarketplaceFilters';
import { ListingCard } from '@/components/pages/marketplace/ListingCard';
import { Reveal } from '@/components/ui/Reveal';
import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useAuthStore } from '@/stores/auth-store';
import { type Listing, type ListingStatus } from '@/data/marketplace';

const VISIBLE_STATUSES: ReadonlyArray<ListingStatus> = [
  'published',
  'reserved',
];

/** Lista pública de publicaciones — sólo muestra `published` y `reserved`.
 *  Las pendientes, rechazadas, archivadas, etc. sólo aparecen en
 *  Mi cuenta o en el panel admin. */
export function MarketplaceBrowser() {
  const listings = useMarketplaceStore((s) => s.listings);
  // Suscribirse a `members` directo y armar un Map O(1) evita
  // re-renders perdidos cuando la comisión modera a un socio
  // (getMember() devolvía el método estable, no la data).
  const members = useAuthStore((s) => s.members);
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members],
  );
  const [filters, setFilters] = useState<MarketplaceFilterState>({
    q: '',
    categoryId: 'all',
    type: 'all',
    sort: 'newest',
  });

  const visible = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return listings
      .filter((l) => VISIBLE_STATUSES.includes(l.status))
      .filter((l) => (filters.type === 'all' ? true : l.type === filters.type))
      .filter((l) =>
        filters.categoryId === 'all'
          ? true
          : l.categoryId === filters.categoryId,
      )
      .filter(
        (l) =>
          q === '' ||
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.zone.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        if (filters.sort === 'price_asc') {
          return (a.price ?? Infinity) - (b.price ?? Infinity);
        }
        if (filters.sort === 'price_desc') {
          return (b.price ?? -Infinity) - (a.price ?? -Infinity);
        }
        return a.createdAt < b.createdAt ? 1 : -1;
      });
  }, [listings, filters]);

  return (
    <>
      <MarketplaceFilters
        state={filters}
        total={visible.length}
        onChange={setFilters}
      />
      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((listing: Listing, i) => (
            <li key={listing.id} className="h-full">
              <Reveal delay={Math.min(i * 60, 480)} className="h-full">
                <ListingCard
                  listing={listing}
                  owner={memberById.get(listing.ownerId)}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface shadow-club rounded-2xl p-10 text-center">
      <p className="text-default-700 text-base font-medium">
        Todavía no hay publicaciones que coincidan con tu búsqueda.
      </p>
      <p className="text-default-500 mt-2 text-sm">
        Probá ampliar la categoría o limpiar los filtros.
      </p>
    </div>
  );
}
