'use client';

/**
 * Route-segment loading UI for `/blog/[slug]`.
 *
 * Triggered automatically by Next.js while the route segment is
 * being prepared. We render the real post layout inside
 * `<phantom-ui loading>` so the shimmer blocks match the actual
 * geometry (title length, paragraph widths, etc.) once the Web
 * Component measures the DOM. The placeholder text is invisible
 * thanks to the `ssr.css` import in the root layout.
 */

import NextLink from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

import { Section, Container, Eyebrow } from '@/components/ui';
import { title } from '@/components/primitives';
import { routes } from '@/lib/routes';

export default function BlogSlugLoading() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <phantom-ui
          loading
          animation="shimmer"
          duration={1.5}
          loading-label="Cargando artículo"
        >
          <NextLink
            className="text-default-600 hover:text-primary mb-6 inline-flex items-center gap-2 text-sm"
            href={routes.blog}
          >
            <FaArrowLeft aria-hidden="true" size={12} /> Volver al blog
          </NextLink>
          <Eyebrow className="mb-3 block" tone="sky">
            Categoría del artículo · fecha del artículo
          </Eyebrow>
          <h1
            className={title({
              size: 'lg',
              class: 'block leading-[1.1]',
            })}
          >
            Título del artículo que estamos cargando
          </h1>
          <p className="text-default-600 mt-6 text-base leading-relaxed md:text-lg">
            Primer párrafo del artículo con suficiente texto para que el shimmer
            block tenga un ancho similar al contenido real.
          </p>
          <p className="text-default-600 mt-4 text-base leading-relaxed md:text-lg">
            Segundo párrafo que también será medido por phantom-ui para generar
            un bloque shimmer encima.
          </p>
        </phantom-ui>
      </Container>
    </Section>
  );
}
