'use client';

import { type FC, type ReactNode } from 'react';
import { Button } from '@heroui/react';

import { cn } from '@/lib/utils';

type HeroUIVariant =
  'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';

export interface IconButtonProps {
  // Label accesible — obligatorio en botones icon-only.
  'aria-label': string;
  // Ícono o cualquier nodo dentro del botón.
  children: ReactNode;
  // Variante visual (HeroUI). Default: `ghost` para nav bar.
  variant?: HeroUIVariant;
  // Tamaño.
  size?: 'sm' | 'md' | 'lg';
  // Handler de click.
  onPress?: () => void;
  // Disabled.
  isDisabled?: boolean;
  // className para overrides puntuales.
  className?: string;
}

// Botón icon-only sobre `<Button isIconOnly>` de HeroUI. aria-label obligatorio.
export const IconButton: FC<IconButtonProps> = ({
  'aria-label': ariaLabel,
  children,
  variant = 'ghost',
  size = 'md',
  onPress,
  isDisabled = false,
  className,
}) => {
  return (
    <Button
      isIconOnly
      aria-label={ariaLabel}
      className={cn(
        // Cuadrado para centrar el ícono visualmente.
        'min-w-0 p-0',
        // Hover bg que contrasta en ambos temas.
        'data-hover=true:bg-foreground/10',
        className,
      )}
      isDisabled={isDisabled}
      size={size}
      variant={variant}
      onPress={onPress}
    >
      {children}
    </Button>
  );
};
