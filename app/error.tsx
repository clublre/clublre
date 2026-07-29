'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Send the error (and any recovered digest from Next) to Sentry
    // so we actually know about problems in production. `error.digest`
    // is the stable id surfaced in the App Router.
    Sentry.captureException(error, {
      tags: { boundary: 'app/error' },
    });
    // Still log locally so devs see it in the browser console.
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Eyebrow className="mb-4 block" tone="sky">
        Error 500
      </Eyebrow>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Algo salió mal
      </h1>
      <p className="text-default-600 mx-auto mt-4 max-w-md">
        Ocurrió un error inesperado al cargar esta página. Probá de nuevo o
        volvé al inicio.
      </p>
      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        type="button"
        onClick={() => reset()}
      >
        Reintentar
      </button>
    </Container>
  );
}
