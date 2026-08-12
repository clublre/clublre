'use client';

// Chromatic Cycler — efecto "Dia" de beui.dev: prefix fijo + palabra
//  ciclada con sweep cromático. Implementado con CSS animations +
//  state (sin framer-motion, manteniendo el bundle lean).
//
//  Cada vez que cambia `index`, el word nuevo se monta con la
//  animación `chromatic-reveal` que:
//   1. entra con translateY + opacity
//   2. el gradiente cromático atraviesa el texto de izq a der
//   3. queda en color foreground (sky)
//
//  Respeta `prefers-reduced-motion`: en ese caso el ciclado sigue
//  pero sin sweep — solo swap de opacidad.

import { useEffect, useState, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

// Suscripción SSR-safe a `prefers-reduced-motion`. `useSyncExternalStore`
// está diseñado para stores externos (matchMedia, window size, etc.) y
// maneja el caso SSR/CSR sin hydration warnings: el server snapshot
// garantiza que el primer render del cliente coincida con el HTML
// server-rendered, y luego se suscribe a los cambios del media query.
const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduceMotion(callback: () => void): () => void {
  const mq = window.matchMedia(REDUCE_MOTION_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReduceMotionSnapshot(): boolean {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches;
}

function getReduceMotionServerSnapshot(): boolean {
  // Default conservador para SSR — matchea el initial state.
  return false;
}

export interface ChromaticCyclerProps {
  /** Frase fija que precede al cycler (ej. "formando "). */
  prefix: string;
  /** Palabras que se ciclan una tras otra. */
  words: ReadonlyArray<string>;
  /** Clases extra para el span externo (tamaño, color, etc). */
  className?: string;
  /** Color del texto revelado (post-sweep). Default: foreground. */
  foregroundClass?: string;
  /** Milisegundos entre cada palabra. Default: 2800. */
  interval?: number;
  /** Duración del sweep en ms. Default: 1200. */
  duration?: number;
}

export function ChromaticCycler({
  prefix,
  words,
  className,
  foregroundClass = 'text-foreground',
  interval = 2800,
  duration = 1200,
}: ChromaticCyclerProps) {
  const [index, setIndex] = useState(0);
  // useSyncExternalStore evita el hydration mismatch del lazy init
  // con `window.matchMedia` y el setState-en-effect de la versión
  // anterior (regla `react-hooks/set-state-in-effect`).
  const reduceMotion = useSyncExternalStore(
    subscribeReduceMotion,
    getReduceMotionSnapshot,
    getReduceMotionServerSnapshot,
  );

  // Cycle cada `interval` ms.
  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  const currentWord = words[index] ?? words[0] ?? '';

  return (
    <span className={cn('inline-block', className)}>
      {prefix}
      <span
        aria-hidden="true"
        // Wrapper relativo para que el word absolute ocupe el espacio
        // del word actual (evita layout shift entre palabras de ancho
        // distinto). `aria-hidden` evita que los SR lean las 3 words
        // (los siblings absolutos ya están ocultos visualmente, pero
        // seguían siendo leídos).
        className="relative inline-block align-baseline"
      >
        {/* Spacer invisible del width del current word — reserva el
            ancho para que los absolute siblings no muevan el prefix. */}
        <span className="invisible">{currentWord}</span>
        {words.map((word, i) => (
          <span
            key={word}
            aria-hidden="true"
            className={cn(
              'absolute inset-0',
              i === index ? foregroundClass : 'opacity-0',
              i === index && !reduceMotion && 'chromatic-reveal',
              i === index && reduceMotion && 'motion-safe-fade',
            )}
            style={{
              animationDuration: `${duration}ms`,
            }}
          >
            {word}
          </span>
        ))}
      </span>
      {/* Single source of truth para SR: una sola mención de la
          palabra actual, fuera del wrapper aria-hidden. */}
      <span className="sr-only">{currentWord}</span>
    </span>
  );
}
