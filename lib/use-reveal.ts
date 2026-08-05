'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook para scroll reveal — usa IntersectionObserver para detectar
 * cuando un elemento entra en viewport. Agrega `data-revealed="true"`
 * al elemento, y el CSS de `globals.css` se encarga de la transición.
 *
 * Si el usuario tiene `prefers-reduced-motion: reduce`, el elemento
 * se marca como revelado inmediatamente (sin animación).
 *
 * El observer se desconecta después del primer reveal — la animación
 * es "one-shot" para no interferir con re-renders ni con scroll-back.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {},
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respetar `prefers-reduced-motion` — saltar la animación.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.setAttribute('data-revealed', 'true');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.setAttribute('data-revealed', 'true');
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
        ...options,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
