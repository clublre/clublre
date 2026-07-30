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
 *
 * Stays a plain `<div>` (not the HeroUI Card) because the site's
 * visual treatment uses brand-specific shadows and a custom
 * `highlighted` flag that doesn't map to any HeroUI Card prop
 * one-to-one. Wrapping `<Card>` here added an extra DOM layer
 * (Card.Header + Card.Content) that broke the existing
 * `flex flex-col` / `mt-auto` layouts in pricing and blog cards.
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
        'group border-default-200/0 bg-surface shadow-club flex flex-col rounded-xl border',
        'hover:shadow-club-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1',
        highlighted &&
          'shadow-club-lg ring-primary ring-offset-background ring-2 ring-offset-2',
        className,
      )}
      {...props}
    >
      {media ? <div className="relative">{media}</div> : null}
      {/* Inner padded wrapper is `flex grow flex-col` so it fills the
          card height (via flex-grow) and lays out its children in a
          flex column. That makes `mt-auto` on a child CTA actually
          work — pinning the button to the bottom even when sibling
          cards in the grid have less content. */}
      <div className="relative flex grow flex-col p-5 sm:p-6">{children}</div>
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
