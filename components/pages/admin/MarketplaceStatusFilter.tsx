'use client';

// Filtro de status del marketplace admin — persiste el status activo
// en la URL via nuqs (`?status=pending` / `published` / `archived` / `all`).
// El default es `pending` porque es el screen primario del moderador.

import { parseAsStringEnum, useQueryState } from 'nuqs';
import { cn } from '@/lib/utils';

export type ListingStatusFilter = 'pending' | 'published' | 'archived' | 'all';

const FILTER_OPTIONS: ReadonlyArray<{
  value: ListingStatusFilter;
  label: string;
}> = [
  { value: 'pending', label: 'En revisión' },
  { value: 'published', label: 'Publicadas' },
  { value: 'archived', label: 'Archivadas' },
  { value: 'all', label: 'Todas' },
];

/** Hook reutilizable: el status actual del filtro, con setter tipado. */
export function useListingStatusFilter() {
  return useQueryState(
    'status',
    parseAsStringEnum<ListingStatusFilter>([
      'pending',
      'published',
      'archived',
      'all',
    ]).withDefault('pending'),
  );
}

export function MarketplaceStatusFilter() {
  const [status, setStatus] = useListingStatusFilter();

  return (
    <div
      aria-label="Filtrar publicaciones por estado"
      className="flex flex-wrap gap-2"
      role="tablist"
    >
      {FILTER_OPTIONS.map((opt) => {
        const active = status === opt.value;
        return (
          <button
            key={opt.value}
            aria-selected={active}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-default-700 hover:bg-foreground/10',
            )}
            role="tab"
            type="button"
            onClick={() => setStatus(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
