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

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
  // Lazy init — leer el media query en el initial state en vez de dentro
  // de un effect evita el warning `react-hooks/set-state-in-effect` y
  // nos da el valor correcto desde el primer render.
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Detectar cambios en vivo (el user puede toggearlo desde el SO).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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
        // Wrapper relativo para que el word absolute ocupe el espacio
        // del word actual (evita layout shift entre palabras de ancho
        // distinto).
        className="relative inline-block align-baseline"
      >
        {/* Spacer invisible del width del current word — reserva el
            ancho para que los absolute siblings no muevan el prefix. */}
        <span aria-hidden="true" className="invisible">
          {currentWord}
        </span>
        {words.map((word, i) => (
          <span
            key={word}
            aria-hidden={i !== index}
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
        {/* Reader copy — siempre la palabra actual para screen readers. */}
        <span className="sr-only">{currentWord}</span>
      </span>
    </span>
  );
}
