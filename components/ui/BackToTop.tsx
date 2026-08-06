'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';

import { ArrowUp } from '@/components/ui/Icons';
import { useScrollProgress } from '@/lib/use-scroll-progress';

// Botón flotante "Volver arriba" — aparece tras scrollear 50% de la página.
// Animación fade+slide-up; respeta `prefers-reduced-motion`.
export function BackToTop() {
  const progress = useScrollProgress();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      const t = window.setTimeout(() => setClicked(false), 600);
      return () => window.clearTimeout(t);
    }
  }, [clicked]);

  // Visible solo si el usuario scrolleó más de 50% de la página.
  const visible = progress > 0.5;

  return (
    <Button
      isIconOnly
      aria-label="Volver arriba"
      className={
        // pointer-events-none cuando no está visible — no interceptar clicks.
        'fixed right-4 bottom-4 z-30 motion-reduce:transition-none ' +
        'shadow-club-lg rounded-full ' +
        (visible
          ? clicked
            ? 'pointer-events-auto scale-90 opacity-0 transition-all duration-300'
            : 'pointer-events-auto scale-100 opacity-100 transition-all duration-300'
          : 'pointer-events-none scale-90 opacity-0 transition-all duration-300')
      }
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
