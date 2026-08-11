import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { title } from '@/components/primitives';
import { siteConfig } from '@/config/site';
import { decadesSince } from '@/lib/utils';

// Mapa número→palabra para "X décadas". Solo cubre 1–10: el club fue
// fundado en 1959, así que la cifra nunca sale de ese rango mientras
// siga existiendo. Si llega a 10 décadas (año 2059) revisamos.
const DECADES_WORDS = [
  '',
  'una',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
] as const;

// Header de about: eyebrow + h1 + intro centrado.
//  `viewTransitionName: 'page-title'` que el resto de headers. */
export function AboutHeader() {
  return (
    <Section as="section" spacing="md">
      <Container className="text-center">
        <Reveal>
          <Eyebrow className="mb-3 block" tone="sky">
            Sobre nosotros
          </Eyebrow>
        </Reveal>
        <Reveal delay={120}>
          <h1
            className={title({
              size: 'lg',
              class: 'mx-auto block max-w-3xl leading-[1.1]',
            })}
            style={{ viewTransitionName: 'page-title' }}
          >
            Una historia ligada a
            <br />
            <span className={title({ color: 'sky', size: 'lg' })}>Rosario</span>
          </h1>
        </Reveal>
        <Reveal delay={220}>
          <p className="text-default-600 mx-auto mt-6 max-w-2xl text-lg">
            Fundado en {siteConfig.foundedYear}, el Club Los Rosarinos
            Estudiantil es una institución deportiva y social con más de 900
            socios. A lo largo de{' '}
            {DECADES_WORDS[decadesSince(siteConfig.foundedYear)]} décadas, hemos
            sido parte de la vida de miles de familias rosarinas, formando
            deportistas y generando comunidad.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
