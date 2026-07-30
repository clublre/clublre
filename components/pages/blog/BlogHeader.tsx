import { Section, Container, Eyebrow } from '@/components/ui';
import { title } from '@/components/primitives';

/**
 * BlogHeader — eyebrow + h1 + tagline. Centred.
 *
 * Server component. Same `viewTransitionName: 'page-title'` pattern
 * as the home / pricing headers so the browser view-transitions API
 * can animate the heading across route changes.
 */
export function BlogHeader() {
  return (
    <Section as="section" spacing="md">
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
          Blog del{' '}
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
