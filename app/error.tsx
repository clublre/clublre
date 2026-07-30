'use client';

import { useEffect } from 'react';
import { Button } from '@heroui/react';
import * as Sentry from '@sentry/nextjs';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { title } from '@/components/primitives';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Mandamos el error a Sentry para enterarnos de problemas en
    // producción. `error.digest` es el id estable del App Router.
    Sentry.captureException(error, {
      tags: { boundary: 'app/error' },
    });
    // Log local para devs en consola del browser.
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <Container
      aria-live="assertive"
      className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center"
      role="alert"
    >
      <Eyebrow className="mb-4 block" tone="sky">
        Error 500
      </Eyebrow>
      <h1 className={title({ size: 'md', class: 'block' })}>Algo salió mal</h1>
      <p className="text-default-600 mx-auto mt-4 max-w-md">
        Ocurrió un error inesperado al cargar esta página. Probá de nuevo o
        volvé al inicio.
      </p>
      <Button
        className="mt-8 font-semibold"
        size="md"
        variant="primary"
        onPress={() => reset()}
      >
        Reintentar
      </Button>
    </Container>
  );
}
