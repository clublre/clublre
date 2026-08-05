'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Button, Chip } from '@heroui/react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { ContactDialog } from '@/components/pages/marketplace/ContactDialog';
import { ReportDialog } from '@/components/pages/marketplace/ReportDialog';
import {
  type Listing,
  type Member,
  findCategory,
  categories,
} from '@/data/marketplace';
import { useAuthStore } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';

interface ListingDetailClientProps {
  listing: Listing;
  owner: Member | undefined;
}

const PRICE_MODE_LABEL = {
  fixed: 'Precio fijo',
  negotiable: 'Negociable',
  free: 'Gratis',
  contact: 'A convenir',
} as const;

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

/** Wrapper client del detalle — controla los modales de contacto y
 *  reporte. La página server component pasa props ya validadas. */
export function ListingDetailClient({
  listing,
  owner,
}: ListingDetailClientProps) {
  // Hidratación: si dependemos de la sesión para mostrar u ocultar
  // botones (contactar / editar / reportar), el server no la conoce
  // y el cliente sí, y el árbol difiere. Lo guardamos detrás del
  // flag `mounted` para que server y cliente rendericen lo mismo en
  // el primer pase.
  const mounted = useHasMounted();
  const currentMember = useAuthStore((s) => s.currentMember());
  const isOwner = mounted && currentMember?.id === listing.ownerId;
  const [contactOpen, setContactOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const category = findCategory(listing.categoryId, categories);

  return (
    <Section as="section" spacing="lg">
      <Container size="md">
        <NextLink
          className="text-default-600 hover:text-primary mb-6 inline-flex items-center gap-2 text-sm"
          href={routes.marketplace}
        >
          ← Volver al listado
        </NextLink>

        <div className="flex items-center gap-2 text-xs">
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
          {listing.status === 'reserved' && (
            <Chip
              className="tracking-wider uppercase"
              color="accent"
              size="sm"
              variant="primary"
            >
              Reservada
            </Chip>
          )}
        </div>

        <h1
          className={title({
            size: 'lg',
            class: 'mt-3 block leading-[1.1]',
          })}
        >
          {listing.title}
        </h1>

        <p className="text-default-700 mt-6 text-base leading-relaxed md:text-lg">
          {listing.description}
        </p>

        <div className="bg-surface shadow-club mt-8 grid gap-4 rounded-2xl p-6 sm:grid-cols-3">
          <div>
            <dt className="text-default-500 text-xs tracking-wider uppercase">
              Precio
            </dt>
            <dd className="text-foreground text-2xl font-bold">
              {listing.priceMode === 'free'
                ? 'Gratis'
                : listing.priceMode === 'contact'
                  ? 'A convenir'
                  : listing.price !== null
                    ? formatPrice(listing.price)
                    : '—'}
            </dd>
            <p className="text-default-500 text-xs">
              {PRICE_MODE_LABEL[listing.priceMode]}
            </p>
          </div>
          <div>
            <dt className="text-default-500 text-xs tracking-wider uppercase">
              Zona
            </dt>
            <dd className="text-foreground text-base font-semibold">
              {listing.zone}
            </dd>
          </div>
          <div>
            <dt className="text-default-500 text-xs tracking-wider uppercase">
              Publicada
            </dt>
            <dd className="text-foreground text-base font-medium">
              {formatDate(listing.createdAt)}
            </dd>
          </div>
        </div>

        {owner && (
          <div className="bg-surface shadow-club mt-6 flex items-center justify-between gap-4 rounded-2xl p-5">
            <div>
              <Eyebrow className="mb-1 block" tone="default">
                Vendedor
              </Eyebrow>
              <p className="text-foreground text-base font-semibold">
                {owner.fullName} {owner.lastInitial}.
              </p>
              <p className="text-default-500 text-xs">
                Socio desde {formatDate(owner.memberSince)}
              </p>
            </div>
            {isOwner ? (
              <NextLink
                className="font-semibold"
                href={routes.marketplaceEdit(listing.id)}
              >
                <Button size="md" variant="outline">
                  Editar publicación
                </Button>
              </NextLink>
            ) : (
              <Button
                size="md"
                variant="primary"
                onPress={() => setContactOpen(true)}
              >
                Contactar
              </Button>
            )}
          </div>
        )}

        {!isOwner && (
          <p className="mt-6 text-center">
            <Button
              className="text-default-500 data-hover:text-default-700 text-xs underline"
              size="sm"
              variant="tertiary"
              onPress={() => setReportOpen(true)}
            >
              Reportar esta publicación
            </Button>
          </p>
        )}
      </Container>

      {owner && (
        <ContactDialog
          isOpen={contactOpen}
          listing={listing}
          owner={owner}
          onOpenChange={setContactOpen}
        />
      )}
      <ReportDialog
        isOpen={reportOpen}
        listing={listing}
        onOpenChange={setReportOpen}
      />
    </Section>
  );
}
