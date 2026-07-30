import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface CardClubProps extends HTMLAttributes<HTMLDivElement> {
  /** Highlight the card (used for featured pricing tiers). */
  highlighted?: boolean;
  /** Optional media slot rendered above the body. */
  media?: ReactNode;
}

/**
 * CardClub — branded card for activities, pricing tiers, blog posts.
 * Minimal look: shadow-only separation, no top stripe or border.
 * Optional `media` slot for icons or images.
 */
export function CardClub({
  highlighted = false,
  media,
  className,
  children,
  ...props
}: CardClubProps) {
  return (
    <div
      className={cn(
        'group border-default-200/0 bg-surface shadow-club rounded-xl border',
        'hover:shadow-club-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1',
        highlighted &&
          'ring-primary ring-offset-background ring-2 ring-offset-2',
        className,
      )}
      {...props}
    >
      {media ? <div className="relative">{media}</div> : null}
      <div className="relative p-6">{children}</div>
    </div>
  );
}

export const CardClubHeader = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-3 flex items-center gap-3', className)} {...props}>
    {children}
  </div>
);

export const CardClubTitle = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn('text-foreground text-xl font-semibold', className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardClubBody = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn('text-default-600 text-sm leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
);
