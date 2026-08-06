import type { HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

// Wrapper semántico de sección — centraliza spacing y variantes
 //  de fondo para mantener consistencia entre páginas. */
const section = tv({
  base: '',
  variants: {
    variant: {
      default: 'bg-background',
      gradient: 'gradient-radial-sky bg-background',
      transparent: 'bg-transparent',
    },
    spacing: {
      none: 'py-0',
      // Compacto: páginas internas (admin, cuenta, login).
      xs: 'py-6 md:py-10',
      // Default para páginas de info.
      sm: 'py-10 md:py-14',
      // Para secciones dentro de home (entre componentes).
      md: 'py-16 md:py-20',
      // Generoso: para hero / landing.
      lg: 'py-20 md:py-28',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'md',
  },
});

export interface SectionProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof section> {
  // Renderiza como <section> (default) u otro elemento.
  as?: 'section' | 'div' | 'article' | 'main';
}

export function Section({
  variant,
  spacing,
  as: Tag = 'section',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn(section({ variant, spacing }), className)} {...props}>
      {children}
    </Tag>
  );
}
