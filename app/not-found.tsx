import NextLink from 'next/link';
import { Button } from '@heroui/react';
import { FaArrowLeft } from 'react-icons/fa';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { title } from '@/components/primitives';

/**
 * Global 404 boundary.
 *
 * Renders automatically when `notFound()` is called from any Server
 * Component or when a route doesn't match. Matches the Club LRE
 * visual language (eyebrow + heading + body + CTA).
 */
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
      <NextLink className="mt-8" href="/">
        <Button className="font-semibold" size="md" variant="primary">
          <FaArrowLeft aria-hidden="true" className="mr-2 size-3.5" />
          Volver al inicio
        </Button>
      </NextLink>
    </Container>
  );
}
