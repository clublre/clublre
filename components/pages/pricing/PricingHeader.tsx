import { Eyebrow } from '@/components/ui';
import { title } from '@/components/primitives';

/** Header de pricing: eyebrow + h1 + tagline centrado. Server component
 *  que devuelve un fragment para que la página lo componga con
 *  `<PricingTiers />` dentro de la misma sección (padding compartido).
 *  El h1 lleva `viewTransitionName: 'page-title'`. */
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
