import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface CardClubProps extends HTMLAttributes<HTMLDivElement> {
  // Resalta la card (planes de cuota destacados).
  highlighted?: boolean;
  // Slot opcional para media arriba del body.
  media?: ReactNode;
}

// Card de marca para actividades, planes y posts.
 //  en lugar de `<Card>` de HeroUI porque el `highlighted` y los
 //  shadows custom no mapean 1:1 a las props de HeroUI. */
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
      {/* Wrapper interno con `flex grow flex-col` para que `mt-auto`
          en un hijo (ej. CTA) lo clave al fondo de la card. */}
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
