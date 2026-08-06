'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { ListingForm } from '@/components/pages/marketplace/ListingForm';
import { useAuthStore } from '@/stores/auth-store';
import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';

export default function EditListingPage() {
  // `useParams` es sync en cliente (Next 16) — sin Promise IIFE ni `getState()`.
  const params = useParams<{ id: string }>();
  const id = params.id;
  const member = useAuthStore((s) => s.currentMember());
  const router = useRouter();
  const mounted = useHasMounted();

  // Suscripción directa al store — re-renderiza cuando cambien listings.
  const listing = useMarketplaceStore((s) =>
    s.listings.find((l) => l.id === id),
  );

  useEffect(() => {
    if (!mounted) return;
    if (!member) {
      router.replace(routes.login);
      return;
    }
    if (member.accountStatus !== 'active') {
      router.replace(routes.accountStatus);
    }
  }, [mounted, member, router]);

  if (!mounted || !member || member.accountStatus !== 'active') {
    return (
      <Section as="section" spacing="md">
        <Container className="text-center" size="md">
          <p className="text-default-600">Verificando tu acceso…</p>
        </Container>
      </Section>
    );
  }

  if (listing === undefined) {
    return (
      <Section as="section" spacing="md">
        <Container className="text-center" size="md">
          <p className="text-default-600">Buscando publicación…</p>
        </Container>
      </Section>
    );
  }

  if (listing && listing.ownerId !== member.id) {
    return (
      <Section as="section" spacing="md">
        <Container className="text-center" size="md">
          <p className="text-default-600">
            Esta publicación no es tuya. Volvé al listado.
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section as="section" spacing="sm">
      <Container className="flex flex-col" size="md">
        <Eyebrow className="mb-3 block" tone="sky">
          Editar publicación
        </Eyebrow>
        <h1
          className={title({
            size: 'md',
            class: 'mb-2 block leading-[1.1]',
          })}
        >
          Modificá tu publicación
        </h1>
        <p className="text-default-600 mb-8">
          Los cambios se aplican de inmediato.
        </p>

        <div className="bg-surface shadow-club rounded-2xl p-6 sm:p-8">
          <ListingForm initial={listing} />
        </div>
      </Container>
    </Section>
  );
}
