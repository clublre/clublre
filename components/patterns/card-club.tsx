import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardClubProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional accent stripe along the top edge. */
  accent?: "azul" | "amarillo" | "gradient";
  /** Highlight the card (used for featured pricing tiers). */
  highlighted?: boolean;
  /** Optional media slot rendered above the body. */
  media?: ReactNode;
}

const accentMap = {
  azul: "before:bg-estu-azul",
  amarillo: "before:bg-estu-amarillo",
  gradient: "before:gradient-estu-2",
};

/**
 * CardClub — branded card for activities, pricing tiers, blog posts.
 * Optional accent stripe at the top + optional `media` slot for icons
 * or images.
 */
export function CardClub({
  accent,
  highlighted = false,
  media,
  className,
  children,
  ...props
}: CardClubProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-default-200 bg-surface shadow-club",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-club-lg",
        accent &&
          "before:absolute before:inset-x-0 before:top-0 before:h-1 before:content-['']",
        accent && accentMap[accent],
        highlighted &&
          "ring-2 ring-estu-azul ring-offset-2 ring-offset-background",
        className,
      )}
      {...props}>
      {media ? <div className='relative'>{media}</div> : null}
      <div className='relative p-6'>{children}</div>
    </div>
  );
}

export const CardClubHeader = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-3 flex items-center gap-3", className)} {...props}>
    {children}
  </div>
);

export const CardClubTitle = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("text-xl font-semibold text-foreground", className)}
    {...props}>
    {children}
  </h3>
);

export const CardClubBody = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm leading-relaxed text-default-600", className)}
    {...props}>
    {children}
  </p>
);
