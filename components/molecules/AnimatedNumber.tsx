'use client';

// Animated Number — count-up cuando el elemento entra al viewport.
// Imita el "Animated Number" de beui.dev: spring-driven count-up
// triggered on view. Uso framer-motion (ya instalado) para:
//
//   - useMotionValue → arranca en 0, target = value
//   - useSpring       → easea con física realista
//   - useTransform    → redondea sincrónicamente al render
//   - useInView       → trigger una vez cuando entra al viewport
//
// Respeta prefers-reduced-motion: si está activo, se renderiza el
// valor final sin animar (mismo comportamiento que beui).

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

export interface AnimatedNumberProps {
  /** Valor final al que el counter va a animar. */
  value: number;
  /** Prefijo (ej. "$" para precios). Se concatena al número. */
  prefix?: string;
  /** Sufijo (ej. "+" para stats). Se concatena al número. */
  suffix?: string;
  /** Si true, formatea con Intl.NumberFormat es-AR ARS currency. */
  currency?: boolean;
  /** Duración aproximada en segundos. Default: 1.4. */
  duration?: number;
  /** Stiffness del spring. Default: 60 (suave). */
  stiffness?: number;
  /** Damping del spring. Default: 20. */
  damping?: number;
  /** Trigger cuando X% del elemento está visible. Default: 0.5. */
  amount?: number;
  /** Una sola vez (default true). Set false para re-animar. */
  once?: boolean;
  /** className aplicada al <motion.span>. */
  className?: string;
  /** locale para Intl.NumberFormat por default. */
  locale?: string;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  currency = false,
  duration = 1.4,
  stiffness = 60,
  damping = 20,
  amount = 0.5,
  once = true,
  className,
  locale = 'es-AR',
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount });

  // Reduce-motion: si el user lo prefirió, saltamos la animación.
  // Lazy init con SSR-safe check. `useState` porque el hook de lint
  // no permite acceder a refs durante render.
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // MotionValue que arranca en 0, anima al `value` cuando entra en view.
  const mv = useMotionValue(0);
  const spring = useSpring(mv, {
    stiffness,
    damping,
    duration: reduceMotion ? 0 : duration,
  });
  // Redondeo a entero mientras el valor cambia — evita display
  // de números con decimales durante el count-up.
  const rounded = useTransform(spring, (latest) => Math.round(latest));

  // Cuando entra en view, animamos al value. Si reduce-motion, saltamos
  // directo al value (el duration=0 del spring hace que el snap sea
  // instantáneo).
  useEffect(() => {
    if (isInView) {
      mv.set(reduceMotion ? value : 0);
      // Pequeño delay para que el primer set arranque el spring
      // desde 0 (no hace falta si reduce-motion).
      if (!reduceMotion) {
        requestAnimationFrame(() => mv.set(value));
      }
    }
  }, [isInView, value, mv, reduceMotion]);

  // Formatter construido desde props serializables. Currency ARS usa
  // Intl.NumberFormat, default group separators con locale.
  const formatter = useMemo(() => {
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
      }).format;
    }
    return (n: number) => n.toLocaleString(locale);
  }, [currency, locale]);

  // Subscribimos al MotionValue para forzar re-render en cada cambio.
  // framer-motion lo hace automáticamente cuando usamos `useTransform`
  // arriba, pero acá queremos el texto — necesitamos un <motion.span>
  // con `useMotionValueEvent` o equivalente.
  const display = useTransform(rounded, (n) => formatter(n));

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
}
