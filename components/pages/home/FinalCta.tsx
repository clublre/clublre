import NextLink from 'next/link';
import Image from 'next/image';
import { Button, Card, Link } from '@heroui/react';
import { ArrowRight, Quote } from '@/components/ui';

import { Section, Container, Eyebrow, InstagramIcon } from '@/components/ui';
import { routes } from '@/lib/routes';

/** CTA principal al final de la home. Plain div con `.gradient-border-sky`
 *  + capa decorativa con el escudo del club como watermark (blur +
 *  desaturado, opacity 7%) y gradiente primary suave. Ambos decorativos
 *  son `aria-hidden` + `pointer-events-none`. */
export function FinalCta() {
  return (
    <Section as="section" spacing="md">
      <Container>
        <Card className="bg-sky-soft relative overflow-hidden p-10 text-center shadow-none! md:p-16">
          {/* Watermark del escudo — centrado, crop circular, muy
              desaturado para que se lea como textura de marca en vez
              de imagen compitiendo con el contenido. */}
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[40%] max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-[1px] grayscale select-none"
            height={500}
            src="/logo2.jpeg"
            width={500}
          />

          {/* Contenido en su propia capa de stacking para que siempre
              pinte arriba del bg decorativo + watermark. */}
          <div className="relative">
            <Quote
              aria-hidden="true"
              className="text-primary/40 mx-auto mb-4 size-10"
            />

            <Eyebrow className="mb-4 block" tone="sky">
              Sumate al club
            </Eyebrow>
            <h2 className="text-foreground mx-auto mb-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              Tres generaciones ya pasaron por acá.
            </h2>
            <p className="text-default-600 mx-auto mb-8 max-w-xl text-base md:text-lg">
              Te invitamos a ser parte. Conocé nuestras cuotas y empezá a
              disfrutar del club hoy mismo.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <NextLink href={routes.pricing}>
                <Button className="font-semibold" size="lg" variant="primary">
                  Quiero asociarme
                  <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                </Button>
              </NextLink>
              <Link
                aria-label="Instagram (se abre en una pestaña nueva)"
                className="text-default-600 hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                href="https://www.instagram.com/clubestudiantilrosario/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <InstagramIcon aria-hidden="true" className="size-4" />
                @clubestudiantilrosario
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
