'use client';

import { useScrollProgress } from '@/lib/use-scroll-progress';

// Barra fija de progreso de scroll — `scaleX` desde el origen (sin reflow).
// aria-hidden + pointer-events-none para no anunciar ni interceptar clicks.
// Respeta `prefers-reduced-motion`.
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
