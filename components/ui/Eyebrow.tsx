import type { HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

// Label uppercase chico arriba de un heading.
const eyebrow = tv({
  base: 'text-xs font-semibold uppercase tracking-[0.2em]',
  variants: {
    tone: {
      default: 'text-default-500',
      sky: 'text-primary',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

export interface EyebrowProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof eyebrow> {}

export function Eyebrow({ tone, className, children, ...props }: EyebrowProps) {
  return (
    <span className={cn(eyebrow({ tone }), className)} {...props}>
      {children}
    </span>
  );
}
