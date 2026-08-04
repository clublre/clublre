// Iconos de marca + iconos temáticos/nav. Todo el código consume
// este módulo en vez de tocar @iconify/react directamente.

import type { FC, SVGProps } from 'react';
import type { IconProps as IconifyIconProps } from '@iconify/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

/** Props base para los SVG icons. */
export interface IconSvgProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/** Wrapper interno que prepende la colección `ph:` (phosphor). */
type IconProps = Omit<IconifyIconProps, 'icon'> & {
  icon: string;
};

const Phosphor = ({ icon, ...rest }: IconProps) => (
  <Icon aria-hidden="true" icon={`ph:${icon}`} {...rest} />
);

/** Props del escudo del club. */
export interface LogoProps {
  /** Ancho Y alto en píxeles (cuadrado). */
  size?: number;
  className?: string;
  /** Marcar como `priority` en posiciones above-the-fold (ej. Navbar). */
  priority?: boolean;
  /** Hint responsive pasado a `next/image` para elegir resolución. */
  sizes?: string;
}

/** Escudo del club — se sirve desde `/public/logo2.jpeg` vía `next/image`. */
export const Logo: FC<LogoProps> = ({
  size = 36,
  className,
  priority = false,
  sizes,
}) => (
  <Image
    alt="Club Los Rosarinos Estudiantil"
    className={cnLogo(className)}
    height={size}
    sizes={sizes}
    src="/logo2.jpeg"
    width={size}
    {...(priority ? { priority: true } : { loading: 'lazy' })}
  />
);

// Helper inline para evitar importar `cn` (mantiene este módulo
// liviano y sin dependencia cruzada a `lib/utils`).
function cnLogo(cls?: string): string {
  return ['h-auto w-auto rounded-full', cls].filter(Boolean).join(' ');
}

// Iconos de tema + navegación.
export const ArrowLeft = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="arrow-left" {...p} />
);
export const ArrowRight = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="arrow-right" {...p} />
);
export const ArrowUp = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="arrow-up" {...p} />
);
export const Menu = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="list" {...p} />
);
export const Home = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="house" {...p} />
);
export const Info = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="info" {...p} />
);
export const Newspaper = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="newspaper" {...p} />
);
export const Tags = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="tag" {...p} />
);
export const Phone = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="phone" {...p} />
);
export const MapPin = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="map-pin-area" {...p} />
);
export const Users = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="users-three" {...p} />
);
export const Calendar = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="calendar-heart" {...p} />
);
export const Check = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="check" {...p} />
);
export const Shield = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="shield" {...p} />
);
export const Quote = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="quotes" {...p} />
);
export const Storefront = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="storefront" {...p} />
);
export const UserCircle = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="user-circle" {...p} />
);

// Iconos de actividades (deportes).

export const BasketballIcon = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="basketball" {...p} />
);
export const VolleyballIcon = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="volleyball" {...p} />
);
export const PingPongIcon = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="ping-pong" {...p} />
);
export const SwimmingIcon = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="person-simple-swim" {...p} />
);
export const HandFistIcon = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="hand-waving" {...p} />
);
export const MedalIcon = (p: Omit<IconProps, 'icon'>) => (
  <Phosphor icon="person-simple-run" {...p} />
);

// Icono de marca (Instagram — versión phosphor, sin SVG custom).

export const InstagramIcon = (p: Omit<IconProps, 'icon'>) => (
  <Icon aria-hidden="true" icon="ph:instagram-logo" {...p} />
);

// SVGs inline para los huecos donde phosphor no tiene el icono.

// Sol outline — usado por ThemeToggle en modo claro. Variante custom
// para mantener el grosor fino que tenía la versión anterior.
export const SunIcon: FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

// Luna llena — usada por ThemeToggle en modo oscuro.
export const MoonFilledIcon: FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);
