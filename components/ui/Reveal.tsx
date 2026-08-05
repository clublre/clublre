'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { useReveal } from '@/lib/use-reveal';
import { cn } from '@/lib/utils';

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Delay en ms antes de la animacion — util para stagger de cards. */
  delay?: number;
  /** Hijos. */
  children: ReactNode;
}

/**
 * Wrapper que aplica el efecto scroll-reveal al subtree.
 *
 * - En SSR: el elemento es visible (CSS no aplica sin `data-reveal`).
 * - Tras mount: el hook agrega `data-revealed="true"` al entrar en
 *   viewport. Sin JS, el elemento queda visible (no FOUC).
 * - Respeta `prefers-reduced-motion: reduce` (lo maneja el hook).
 *
 * Para usar en `<li>` / `<article>` / etc., el caller envuelve el
 * `<Reveal>` con el elemento semantico apropiado:
 *   <li><Reveal delay={i * 80}><CardClub /></Reveal></li>
 *
 * Uso:
 *   <Reveal>Titulo</Reveal>
 *   <Reveal delay={100}>Card</Reveal>
 *   <Reveal delay={i * 80}>...</Reveal>
 */
export function Reveal({
  delay = 0,
  className,
  children,
  ...props
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(className)}
      data-reveal="pending"
      data-revealed="false"
      style={delay > 0 ? { transitionDelay: '${delay}ms' } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
