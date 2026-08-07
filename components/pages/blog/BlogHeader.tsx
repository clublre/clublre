import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { title } from '@/components/primitives';

// Header del blog: eyebrow + h1 + tagline centrado.
//  `viewTransitionName: 'page-title'` entre home / otras páginas para
//  animar entre rutas. */
export function BlogHeader() {
  return (
    <Section as="section" spacing="sm">
      <Container className="text-center">
        <Eyebrow className="mb-3 block" tone="sky">
          Novedades
        </Eyebrow>
        <h1
          className={title({
            size: 'lg',
            class: 'mx-auto block max-w-3xl leading-[1.1]',
          })}
          style={{ viewTransitionName: 'page-title' }}
        >
          Noticias del{' '}
          <span className={title({ color: 'sky', size: 'lg' })}>club</span>
        </h1>
        <p className="text-default-600 mx-auto mt-4 max-w-2xl">
          Novedades institucionales, resultados deportivos y todo lo que pasa en
          el club.
        </p>
      </Container>
    </Section>
  );
}
