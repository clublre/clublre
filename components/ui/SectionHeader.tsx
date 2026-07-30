import type { HTMLAttributes, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';
import { title } from '@/components/primitives';

/**
 * SectionHeader — shared layout for the eyebrow + heading + optional
 * description that opens every page section. Centralises the rhythm
 * (margin-bottom, max-width, alignment) so pages can stop hand-rolling
 * four near-identical blocks.
 *
 * Use inside a <Section>; the bottom margin is sized to match the
 * spacing scale used across the app (`mb-10` for narrow descriptions,
 * `mb-12` for grids).
 */
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
  /** Small uppercase label above the heading. */
  eyebrow: string;
  /** Section heading — renders as <h2> by default. */
  heading: ReactNode;
  /** Tone of the eyebrow. Defaults to `sky`. */
  tone?: 'default' | 'sky' | 'amarillo';
  /** Optional body copy below the heading. */
  description?: ReactNode;
  /** Optional trailing slot — used by the home page for the
   *  "Ver todos los posts" link. */
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
