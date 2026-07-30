import type { FC, SVGProps } from 'react';
import Image from 'next/image';

/**
 * Props shared by every brand SVG icon. Inlined here (rather than in
 * a top-level `types/` barrel) because only this file consumes them.
 */
export interface IconSvgProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Props for the brand logo. Narrower than {@link IconSvgProps} because
 * the logo is an image, not an SVG — SVG-specific event handlers
 * (`onCopy` on `SVGSVGElement`, etc.) don't apply.
 */
export interface LogoProps {
  /** Render width AND height in pixels (square). */
  size?: number;
  className?: string;
  /**
   * Pass `priority` for above-the-fold placements (Navbar brand on
   * first paint). Other positions — Footer, deep-linked pages — get
   * lazy loading by default which avoids redundant preload work
   * for an asset the user has already cached.
   */
  priority?: boolean;
  /**
   * Explicit responsive sizes hint (passed through to next/image)
   * so the browser can pick the right resolution from the source-set.
   */
  sizes?: string;
}

/**
 * Brand shield — the actual Club LRE escudo, served from
 * `/public/logo2.jpeg` and routed through `next/image` so Next can
 * resize/cache it. The logo already contains its own brand colours
 * (navy + sky + gold) so no theme adaptation is needed.
 */
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

// Tiny className helper kept inline to avoid pulling `cn` from
// `lib/utils` (which would create an awkward cross-folder import in
// this lightweight icon module).
function cnLogo(cls?: string): string {
  return ['h-auto w-auto rounded-full', cls].filter(Boolean).join(' ');
}

/**
 * Outline sun icon — used by ThemeToggle in light mode.
 * Lucide-style: a circle with 8 rays around it, drawn with stroke.
 * Replaces the previous filled variant for a lighter visual weight.
 */
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

/**
 * HeroUI MoonFilledIcon — used by ThemeToggle in dark mode.
 */
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
