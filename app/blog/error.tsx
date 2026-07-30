'use client';

import { useEffect } from 'react';
import { Button } from '@heroui/react';
import * as Sentry from '@sentry/nextjs';
import NextLink from 'next/link';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { title } from '@/components/primitives';
import { routes } from '@/lib/routes';

/**
 * Route-segment error boundary for `/blog/[slug]`.
 *
 * Lives inside the blog segment so a thrown error there can't
 * crash the whole layout (Navbar / Footer stay alive, only the
 * post body is replaced with this fallback).
 */
export default function BlogSlugError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { boundary: 'blog/[slug]' },
    });
    console.error('[BlogSlugBoundary]', error);
  }, [error]);

  return (
    <div aria-live="assertive" className="py-16 md:py-24" role="alert">
      <Container className="text-center" size="md">
        <Eyebrow className="mb-4 block" tone="sky">
          Error al cargar el artículo
        </Eyebrow>
        <h1 className={title({ size: 'md', class: 'block' })}>
          No pudimos mostrar este post
        </h1>
        <p className="text-default-600 mx-auto mt-3 max-w-md text-base">
          Algo se rompió mientras cargábamos el contenido. Reintentá o volvé al
          listado para elegir otro artículo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            className="font-semibold"
            size="md"
            variant="primary"
            onPress={() => reset()}
          >
            Reintentar
          </Button>
          <NextLink href={routes.blog}>
            <Button className="font-semibold" size="md" variant="outline">
              Ver todos los posts
            </Button>
          </NextLink>
        </div>
      </Container>
    </div>
  );
}
