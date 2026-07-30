'use client';

// Loading UI para `/blog/[slug]`. Renderiza el layout real del post
// dentro de `<phantom-ui loading>` para que los shimmer blocks matcheen
// la geometría real (largo del título, ancho de párrafos).

import NextLink from 'next/link';
import { ArrowLeft } from '@/components/ui';

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
            <ArrowLeft aria-hidden="true" height={12} width={12} /> Volver al
            blog
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
