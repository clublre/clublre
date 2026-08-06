'use client';

// Loading UI raíz — Next.js lo renderiza mientras se prepara cualquier
// segmento sin su propio `loading.tsx`.

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { title } from '@/components/primitives';

export default function RootLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="py-24 md:py-32"
      role="status"
    >
      <phantom-ui
        loading
        animation="shimmer"
        duration={1.5}
        loading-label="Cargando contenido"
      >
        <Container className="text-center" size="md">
          <Eyebrow className="mb-3 block" tone="sky">
            Cargando sección
          </Eyebrow>
          <h1
            className={title({
              size: 'lg',
              class: 'mx-auto block max-w-3xl leading-[1.1]',
            })}
          >
            Estamos preparando todo para vos
          </h1>
          <p className="text-default-600 mx-auto mt-4 max-w-xl text-base">
            Un momento mientras cargamos el contenido del club.
          </p>
        </Container>
      </phantom-ui>
    </div>
  );
}
