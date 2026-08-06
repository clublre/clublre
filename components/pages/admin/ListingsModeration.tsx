'use client';
import { useMemo } from 'react';

import NextLink from 'next/link';
import { Button, Chip } from '@heroui/react';

import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  type Listing,
  type ListingStatus,
  categories,
  findCategory,
} from '@/data/marketplace';
import { Archive, Check, X } from '@/components/ui/Icons';
import {
  MarketplaceStatusFilter,
  useListingStatusFilter,
  type ListingStatusFilter as ListingStatusFilterValue,
} from '@/components/pages/admin/MarketplaceStatusFilter';
import { routes } from '@/lib/routes';

const STATUS_LABEL: Record<ListingStatus, string> = {
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
  ListingStatus,
  'warning' | 'success' | 'default' | 'danger' | 'accent'
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

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));

// Map del filtro semántico de nuqs al listado de statuses. "all" = cualquier estado.
// Module-level para que useMemo no lo necesite como dep.
const STATUSES_FOR_FILTER: Record<ListingStatusFilterValue, ListingStatus[]> = {
  pending: ['pending_review'],
  published: ['published', 'reserved'],
  archived: ['archived'],
  all: [
    'pending_review',
    'published',
    'reserved',
    'archived',
    'rejected',
    'sold',
  ],
};

/** Cola de moderación — filtros por estado,
 *  acciones de aprobar / rechazar / archivar. */
export function ListingsModeration() {
  const listings = useMarketplaceStore((s) => s.listings);
  const setListingStatus = useMarketplaceStore((s) => s.setListingStatus);
  const members = useAuthStore((s) => s.members);
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members],
  );
  const currentMember = useAuthStore((s) => s.currentMember());
  const [statusFilter] = useListingStatusFilter();

  const filtered = useMemo(
    () =>
      listings.filter((l) =>
        STATUSES_FOR_FILTER[statusFilter].includes(l.status),
      ),
    [listings, statusFilter],
  );

  // Orden: pending_review primero, luego fecha desc.
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'pending_review' && b.status !== 'pending_review') {
      return -1;
    }
    if (b.status === 'pending_review' && a.status !== 'pending_review') {
      return 1;
    }
    return a.createdAt < b.createdAt ? 1 : -1;
  });

  return (
    <div className="flex flex-col gap-4">
      <MarketplaceStatusFilter />

      {sorted.length === 0 ? (
        <p className="text-default-600 text-sm">
          No hay publicaciones en este estado.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((listing: Listing) => {
            const owner = memberById.get(listing.ownerId);
            const category = findCategory(listing.categoryId, categories);
            return (
              <li
                key={listing.id}
                className="bg-surface shadow-club rounded-xl p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 grow">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                      <Chip
                        className="capitalize"
                        color="accent"
                        size="sm"
                        variant="soft"
                      >
                        {category?.name ?? 'Sin categoría'}
                      </Chip>
                      <Chip
                        className="capitalize"
                        color={STATUS_COLOR[listing.status]}
                        size="sm"
                        variant={
                          listing.status === 'pending_review'
                            ? 'primary'
                            : 'soft'
                        }
                      >
                        {STATUS_LABEL[listing.status]}
                      </Chip>
                      <span className="text-default-500">
                        {(() => {
                          return owner
                            ? `${owner.fullName} ${owner.lastInitial}.`
                            : 'Socio';
                        })()}
                      </span>
                    </div>
                    <NextLink
                      className="text-foreground hover:text-primary text-base font-semibold"
                      href={routes.marketplaceItem(listing.id)}
                    >
                      {listing.title}
                    </NextLink>
                    <p className="text-default-600 mt-1 line-clamp-2 text-sm">
                      {listing.description}
                    </p>
                    <p className="text-default-500 mt-1 text-xs">
                      {formatDate(listing.createdAt)} · {listing.zone}
                    </p>
                  </div>

                  <div className="flex flex-row gap-2 sm:flex-col sm:items-end">
                    {listing.status === 'pending_review' && (
                      <>
                        <Button
                          className="inline-flex items-center gap-1.5 font-semibold"
                          size="sm"
                          variant="primary"
                          onPress={() =>
                            currentMember &&
                            setListingStatus(
                              listing.id,
                              'published',
                              currentMember.id,
                              'Aprobada por moderación',
                            )
                          }
                        >
                          <Check
                            aria-hidden="true"
                            className="size-4 shrink-0"
                          />
                          Aprobar
                        </Button>
                        <Button
                          className="inline-flex items-center gap-1.5 font-semibold"
                          size="sm"
                          variant="danger"
                          onPress={() =>
                            currentMember &&
                            setListingStatus(
                              listing.id,
                              'rejected',
                              currentMember.id,
                              'Rechazada por moderación',
                            )
                          }
                        >
                          <X aria-hidden="true" className="size-4 shrink-0" />
                          Rechazar
                        </Button>
                      </>
                    )}
                    {listing.status === 'published' && (
                      <Button
                        className="inline-flex items-center gap-1.5 font-semibold"
                        size="sm"
                        variant="outline"
                        onPress={() =>
                          currentMember &&
                          setListingStatus(
                            listing.id,
                            'archived',
                            currentMember.id,
                            'Archivada por moderación',
                          )
                        }
                      >
                        <Archive
                          aria-hidden="true"
                          className="size-4 shrink-0"
                        />
                        Archivar
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
