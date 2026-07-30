import { Section, Container, Eyebrow } from '@/components/ui';
import { title } from '@/components/primitives';

/**
 * AboutHeader — eyebrow + h1 + intro paragraph. Centred.
 *
 * Server component. Same `viewTransitionName: 'page-title'` pattern
 * as home / pricing / blog so the browser view-transitions API can
 * animate the heading across route changes.
 */
export function AboutHeader() {
  return (
    <Section as="section" spacing="md">
      <Container className="text-center">
        <Eyebrow className="mb-3 block" tone="sky">
          Sobre nosotros
        </Eyebrow>
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
        <p className="text-default-600 mx-auto mt-6 max-w-2xl text-lg">
          Fundado en 1943, el Club Los Rosarinos Estudiantil es una institución
          deportiva y social con más de 3.500 socios. A lo largo de ocho
          décadas, hemos sido parte de la vida de miles de familias rosarinas,
          formando deportistas y generando comunidad.
        </p>
      </Container>
    </Section>
  );
}
