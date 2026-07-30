import type { HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

/** Wrapper semántico de sección. Centraliza spacing y variantes
 *  de fondo para mantener consistencia entre páginas. */
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
      sm: 'py-10 md:py-14',
      md: 'py-16 md:py-20',
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
  /** Renderiza como `<section>` (default) u otro elemento. */
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
