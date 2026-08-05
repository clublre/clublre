'use client';

import { type FC } from 'react';
import { useTheme } from 'next-themes';
import { useIsSSR } from '@react-aria/ssr';

import { IconButton } from '@/components/atoms/IconButton';
import { MoonFilledIcon, SunIcon } from '@/components/ui/Icons';

export interface ThemeToggleProps {
  className?: string;
  /** Tamaño visual del ícono. */
  size?: 'sm' | 'md' | 'lg';
}

/** Toggle claro/oscuro como botón icon-only. Molécula: compone
 *  `IconButton` con `next-themes`. Muestra sol en light y luna en dark. */
export const ThemeToggle: FC<ThemeToggleProps> = ({
  className,
  size = 'md',
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isLight = theme === 'light' || isSSR;

  const onPress = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  return (
    <IconButton
      aria-label={`Cambiar a tema ${isLight ? 'oscuro' : 'claro'}`}
      className={className}
      size={size}
      variant="ghost"
      onPress={onPress}
    >
      {/* `text-default-700` mantiene el ícono visible en ambos temas
          sin necesidad de `bg-transparent`. */}
      <span
        aria-hidden="true"
        className="text-default-700 group-data-hover:text-foreground inline-flex transition-colors"
      >
        {isLight ? <SunIcon size={20} /> : <MoonFilledIcon size={20} />}
      </span>
    </IconButton>
  );
};
