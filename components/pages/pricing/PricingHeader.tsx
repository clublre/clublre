import { Eyebrow } from '@/components/ui';
import { title } from '@/components/primitives';

/**
 * PricingHeader — eyebrow + h1 + tagline. Centred.
 *
 * Server component. Returns a fragment (no <Section>/<Container>)
 * so the page can compose it together with <PricingTiers /> inside
 * the same section — that's intentional design (shared padding so
 * they read as one block).
 *
 * The h1 carries `viewTransitionName: 'page-title'` so the browser
 * view-transitions API can animate the heading across route
 * changes.
 */
export function PricingHeader() {
  return (
    <div className="mb-12 text-center md:mb-16">
      <Eyebrow className="mb-3 block" tone="sky">
        Cuotas 2026
      </Eyebrow>
      <h1
        className={title({
          size: 'lg',
          class: 'block leading-[1.1]',
        })}
        style={{ viewTransitionName: 'page-title' }}
      >
        Elegí tu{' '}
        <span className={title({ color: 'sky', size: 'lg' })}>cuota</span>
      </h1>
      <p className="text-default-600 mx-auto mt-4 max-w-xl">
        Planes para individuales, familias y menores. Sin matrícula, sin
        sorpresas.
      </p>
    </div>
  );
}
