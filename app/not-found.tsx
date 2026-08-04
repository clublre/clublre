import NextLink from 'next/link';
import { Button } from '@heroui/react';
import { ArrowLeft } from '@/components/ui/Icons';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { title } from '@/components/primitives';
import { routes } from '@/lib/routes';

/** 404 global. Se renderiza cuando se llama a `notFound()` desde
 *  cualquier Server Component o cuando una ruta no matchea. */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Eyebrow className="mb-4 block" tone="sky">
        Error 404
      </Eyebrow>
      <h1 className={title({ size: 'md', class: 'block' })}>
        Página no encontrada
      </h1>
      <p className="text-default-600 mx-auto mt-4 max-w-md">
        La página que buscás no existe o fue movida. Volvé al inicio y seguí
        explorando el club.
      </p>
      <NextLink className="mt-8" href={routes.home}>
        <Button className="font-semibold" size="md" variant="primary">
          <ArrowLeft aria-hidden="true" className="mr-2 size-3.5" />
          Volver al inicio
        </Button>
      </NextLink>
    </Container>
  );
}
