'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { useReveal } from '@/lib/use-reveal';
import { cn } from '@/lib/utils';

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Delay en ms — útil para stagger de cards. */
  delay?: number;
  children: ReactNode;
}

// Wrapper scroll-reveal: en SSR visible (no FOUC); tras mount agrega
// `data-revealed="true"` al entrar en viewport. Respeta
// `prefers-reduced-motion` (lo maneja el hook).
//   <li><Reveal delay={i * 80}><CardClub /></Reveal></li>
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
