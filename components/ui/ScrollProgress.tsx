'use client';

import { useScrollProgress } from '@/lib/use-scroll-progress';

/**
 * Barra fina de progreso de scroll — fixed en el top del viewport
 * sobre todo lo demás (`z-50` arriba del navbar). Crece con `scaleX`
 * desde el origen izquierdo, sin reflow.
 *
 * - Respetamos `prefers-reduced-motion` desactivando la transición.
 * - `aria-hidden="true"` para que no se anuncie el progreso.
 * - `pointer-events-none` para no interceptar clicks.
 */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="bg-primary pointer-events-none fixed top-0 right-0 left-0 z-50 h-0.5 origin-left transition-transform duration-100 motion-reduce:transition-none"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
