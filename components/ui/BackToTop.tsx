'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';

import { ArrowUp } from '@/components/ui/Icons';
import { useScrollProgress } from '@/lib/use-scroll-progress';

/**
 * Botón flotante "Volver arriba" — aparece después de scrollear
 * más de 50% de la página. Fixed bottom-right, sobre el contenido
 * importante pero debajo del navbar.
 *
 * Animación: fade + slide-up al aparecer, fade al click.
 * Respeta `prefers-reduced-motion` (sin transition).
 */
export function BackToTop() {
  const progress = useScrollProgress();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      const t = window.setTimeout(() => setClicked(false), 600);
      return () => window.clearTimeout(t);
    }
  }, [clicked]);

  // Sólo visible si el usuario scrolleó más de 50% de la página.
  const visible = progress > 0.5;

  return (
    <Button
      aria-label="Volver arriba"
      className={
        // Posición + z-index por encima del contenido principal, debajo del navbar.
        // `pointer-events-none` cuando no está visible para no interceptar clicks.
        'motion-reduce:transition-none fixed right-4 bottom-4 z-30 ' +
        'rounded-full shadow-club-lg ' +
        (visible
          ? (clicked
              ? 'pointer-events-auto scale-90 opacity-0 transition-all duration-300'
              : 'pointer-events-auto scale-100 opacity-100 transition-all duration-300')
          : 'pointer-events-none scale-90 opacity-0 transition-all duration-300')
      }
      isIconOnly
      size="md"
      variant="primary"
      onPress={() => {
        setClicked(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <ArrowUp aria-hidden="true" className="size-4" />
    </Button>
  );
}
