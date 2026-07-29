'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import NextLink from 'next/link';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

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
    <div className="py-16 md:py-24">
      <Container size="md" className="text-center">
        <Eyebrow className="mb-4 block" tone="sky">
          Error al cargar el artículo
        </Eyebrow>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          No pudimos mostrar este post
        </h1>
        <p className="text-default-600 mx-auto mt-3 max-w-md text-base">
          Algo se rompió mientras cargábamos el contenido. Reintentá o volvé
          al listado para elegir otro artículo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            type="button"
            onClick={() => reset()}
          >
            Reintentar
          </button>
          <NextLink
            className="text-default-700 hover:text-primary border-default-200 hover:border-primary rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            href="/blog"
          >
            Ver todos los posts
          </NextLink>
        </div>
      </Container>
    </div>
  );
}
