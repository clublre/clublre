import type { HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

/** Wrapper de max-width fijo con padding horizontal. Usar dentro
 *  de `<Section>` para gutters consistentes entre breakpoints. */
const container = tv({
  base: 'mx-auto w-full px-6',
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-none',
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof container> {}

export function Container({
  size,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div className={cn(container({ size }), className)} {...props}>
      {children}
    </div>
  );
}
