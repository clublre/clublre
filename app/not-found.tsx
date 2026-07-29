import NextLink from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

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
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Página no encontrada
      </h1>
      <p className="text-default-600 mx-auto mt-4 max-w-md">
        La página que buscás no existe o fue movida. Volvé al inicio y
        seguí explorando el club.
      </p>
      <NextLink
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        href="/"
      >
        <FaArrowLeft size={12} /> Volver al inicio
      </NextLink>
    </Container>
  );
}
