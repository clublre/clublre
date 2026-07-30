import type { HTMLAttributes, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';
import { title } from '@/components/primitives';

/** Header compartido: eyebrow + título + descripción opcional.
 *  Usar dentro de un <Section>; el margin-bottom sigue la escala
 *  de spacing de la app. */
const sectionHeader = tv({
  base: 'mx-auto',
  variants: {
    align: {
      center: 'text-center',
      left: 'text-left',
    },
    width: {
      sm: 'max-w-xl',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      full: 'max-w-none',
    },
    spacing: {
      sm: 'mb-8',
      md: 'mb-10',
      lg: 'mb-12',
    },
  },
  defaultVariants: {
    align: 'center',
    width: 'md',
    spacing: 'lg',
  },
});

export interface SectionHeaderProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof sectionHeader> {
  /** Label uppercase arriba del título. */
  eyebrow: string;
  /** Título de la sección — renderiza como `<h2>` por default. */
  heading: ReactNode;
  /** Tono del eyebrow. Default: `sky`. */
  tone?: 'default' | 'sky';
  /** Copia opcional debajo del título. */
  description?: ReactNode;
  /** Slot trailing opcional (ej. link "Ver todos"). */
  trailing?: ReactNode;
}

export function SectionHeader({
  align,
  width,
  spacing,
  eyebrow,
  heading,
  tone = 'sky',
  description,
  trailing,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(sectionHeader({ align, width, spacing }), className)}
      {...props}
    >
      <Eyebrow className="mb-3 block" tone={tone}>
        {eyebrow}
      </Eyebrow>
      <h2 className={title({ size: 'md', class: 'block' })}>{heading}</h2>
      {description ? (
        <p className="text-default-600 mx-auto mt-4 max-w-xl text-base">
          {description}
        </p>
      ) : null}
      {trailing ? <div className="mt-4">{trailing}</div> : null}
    </div>
  );
}
