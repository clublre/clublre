'use client';

import { type FC, useState } from 'react';
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
 *  `IconButton` con `next-themes`. Muestra sol en light y luna en dark.
 *
 *  Al alternar, el ícono rota 360° y se desvanece brevemente — anima
 *  el cambio de tema con feedback visual. Después settleamos al ícono
 *  destino (sol o luna) con un fade-in. */
export const ThemeToggle: FC<ThemeToggleProps> = ({
  className,
  size = 'md',
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isLight = theme === 'light' || isSSR;

  // Al click, `spinning` va true por ~500ms. El CSS rota el ícono
  // 360° y aprovecha ese intervalo para switchear el sol/luna.
  // El `setTimeout` resetea a false cuando termina la animación, sin
  // necesitar un `useEffect` (que dispararía cascading renders).
  const [spinning, setSpinning] = useState(false);

  const onPress = () => {
    if (spinning) return;
    setSpinning(true);
    setTheme(isLight ? 'dark' : 'light');
    // Damos tiempo al icon a rotar antes de cambiar la silueta.
    window.setTimeout(() => setSpinning(false), 600);
  };

  return (
    <IconButton
      aria-label={`Cambiar a tema ${isLight ? 'oscuro' : 'claro'}`}
      className={className}
      size={size}
      variant="ghost"
      onPress={onPress}
    >
      <span
        aria-hidden="true"
        className="text-default-700 group-data-hover:text-foreground inline-flex transition-colors"
      >
        <span
          className={
            'inline-flex motion-reduce:transition-none ' +
            (spinning
              ? 'rotate-180 opacity-0 transition-all duration-500 ease-in-out'
              : 'rotate-0 opacity-100 transition-all duration-300 ease-out')
          }
        >
          {isLight ? <SunIcon size={20} /> : <MoonFilledIcon size={20} />}
        </span>
      </span>
    </IconButton>
  );
};
