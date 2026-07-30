import NextLink from 'next/link';
import { Button } from '@heroui/react';
import { ArrowRight, Shield } from '@/components/ui';

import { Section, Container, Eyebrow, BlurryBlob } from '@/components/ui';
import { title, subtitle } from '@/components/primitives';
import { routes } from '@/lib/routes';

/** Hero — primer impacto de marca arriba de la home.
 *  Server component. Compone BlurryBlob + eyebrow + h1 con span
 *  gradiente + par de CTAs. El h1 lleva `viewTransitionName: 'page-title'`
 *  para animar entre rutas vía la View Transitions API. */
export function Hero() {
  return (
    <Section
      as="section"
      className="relative isolate overflow-hidden"
      spacing="lg"
      variant="gradient"
    >
      <BlurryBlob />

      <Container className="animate-fade-in relative z-10 text-center">
        {/* Eyebrow con escudo — establece la marca desde el primer pixel */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <Shield aria-hidden="true" className="text-primary size-3.5" />
          <Eyebrow className="text-default-100 m-0" tone="default">
            Club Los Rosarinos Estudiantil
          </Eyebrow>
        </div>

        <h1
          className={title({
            size: 'lg',
            class: 'mx-auto block max-w-4xl leading-[1.05]',
          })}
          style={{ viewTransitionName: 'page-title' }}
        >
          Más de 80 años{' '}
          <span className={title({ color: 'sky', size: 'lg' })}>
            formando comunidad
          </span>
        </h1>

        <p
          className={subtitle({
            class: 'text-default-100 mx-auto mt-6 max-w-xl text-center',
          })}
        >
          Deportes, recreación y vida social para toda la familia en el corazón
          de Rosario.
        </p>

        {/* CTA primario + link secundario (sin botones compitiendo) */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-baseline sm:justify-center">
          <NextLink href={routes.pricing}>
            <Button
              className="shadow-club-lg font-semibold"
              size="lg"
              variant="primary"
            >
              Conocé las cuotas
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Button>
          </NextLink>
          <NextLink
            className="text-default-100 hover:text-foreground inline-flex items-baseline text-sm font-medium transition-colors sm:ml-2"
            href={routes.about}
          >
            o leé nuestra historia →
          </NextLink>
        </div>
      </Container>
    </Section>
  );
}
