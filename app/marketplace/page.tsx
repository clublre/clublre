import NextLink from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@heroui/react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { MarketplaceBrowser } from '@/components/pages/marketplace/MarketplaceBrowser';
import { StickyPublishButton } from '@/components/pages/marketplace/StickyPublishButton';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Entre Socios — Marketplace del club',
  description:
    'Compra, vende o intercambia bienes y servicios con otros socios del Club Los Rosarinos Estudiantil.',
  robots: { index: false, follow: false },
};

export default function MarketplacePage() {
  return (
    <Section as="section" spacing="sm">
      <Container size="xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow className="mb-3 block" tone="sky">
              Marketplace interno
            </Eyebrow>
            <h1
              className={title({
                size: 'lg',
                class: 'block leading-[1.1]',
              })}
              style={{ viewTransitionName: 'page-title' }}
            >
              Entre{' '}
              <span className={title({ color: 'sky', size: 'lg' })}>
                Socios
              </span>
            </h1>
            <p className="text-default-600 mt-3 max-w-xl">
              Publicaciones de otros socios. Coordiná el pago y la entrega
              directamente con el dueño — el club no participa de la operación.
            </p>
          </div>
          <NextLink href={routes.marketplaceNew}>
            <Button className="font-semibold" size="lg" variant="primary">
              Publicar
            </Button>
          </NextLink>
        </div>

        <MarketplaceBrowser />
      </Container>
      <StickyPublishButton />
    </Section>
  );
}
