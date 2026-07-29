'use client';

import { useEffect } from 'react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // TODO: replace with a real error reporting service (e.g. Sentry)
    //       once we have one. For now we log to the browser console so
    //       devs can see the issue locally.
    console.error('[ErrorBoundary] an error was caught');
  }, []);

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
