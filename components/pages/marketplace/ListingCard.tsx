'use client';

import NextLink from 'next/link';
import { Chip } from '@heroui/react';

import { CardClub } from '@/components/ui/CardClub';
import { routes } from '@/lib/routes';
import {
  type Listing,
  type Member,
  findCategory,
  categories,
} from '@/data/marketplace';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n);

const PRICE_MODE_LABEL = {
  fixed: 'Precio fijo',
  negotiable: 'Negociable',
  free: 'Gratis',
  contact: 'A convenir',
} as const;

interface ListingCardProps {
  listing: Listing;
  owner: Member | undefined;
}

/** Card de publicación — usada en el listado de Entre Socios. */
export function ListingCard({ listing, owner }: ListingCardProps) {
  const category = findCategory(listing.categoryId, categories);
  return (
    <NextLink
      aria-label={`Ver ${listing.title}`}
      className="block h-full"
      href={routes.marketplaceItem(listing.id)}
    >
      <CardClub className="hover:border-primary/30 h-full transition-colors">
        <div className="mb-3 flex items-center justify-between text-xs">
          <Chip
            className="tracking-wider uppercase"
            color="accent"
            size="sm"
            variant="soft"
          >
            {category?.name ?? 'Sin categoría'}
          </Chip>
          <Chip
            className="tracking-wider uppercase"
            color={listing.type === 'service' ? 'accent' : 'default'}
            size="sm"
            variant={listing.type === 'service' ? 'primary' : 'soft'}
          >
            {listing.type === 'service' ? 'Servicio' : 'Bien'}
          </Chip>
        </div>
        <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
          {listing.title}
        </h3>
        <p className="text-default-600 mt-2 line-clamp-3 text-sm">
          {listing.description}
        </p>
        <div className="mt-4 flex items-baseline justify-between border-t border-default-200/40 pt-3 text-sm">
          <span className="text-default-500">{listing.zone}</span>
          <span className="text-foreground font-bold">
            {listing.priceMode === 'free'
              ? 'Gratis'
              : listing.priceMode === 'contact'
                ? 'A convenir'
                : listing.price !== null
                  ? formatPrice(listing.price)
                  : ''}
          </span>
        </div>
        {owner ? (
          <p className="text-default-500 mt-2 text-xs">
            {owner.fullName} {owner.lastInitial}. ·{' '}
            {PRICE_MODE_LABEL[listing.priceMode]}
          </p>
        ) : null}
      </CardClub>
    </NextLink>
  );
}