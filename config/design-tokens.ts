/**
 * Club LRE — Design tokens (TypeScript)
 *
 * Source of truth for tokens that live both in styles/globals.css
 * (`@theme`) and in code (tailwind-variants, inline `fill`, etc).
 *
 * Domain / editorial content (activities, commission, pricing tiers,
 * blog posts) lives in `data/` — not here. This file is purely
 * visual tokens + class-string helpers for tailwind-variants.
 *
 * Sky palette values are mirrored from `@layer base` in
 * styles/globals.css, where HeroUI's defaults are overridden.
 */

export const brand = {
  /** Active HeroUI theme — single source of truth for the palette name. */
  theme: "sky",
  /** Secondary brand — Club LRE amarillo (accent / hover / CTA only). */
  amarillo: "#EEE457",
  /** HeroUI Sky accent — light mode oklch (matches globals.css). */
  skyLight: "oklch(0.685 0.169 237.32)",
  /** HeroUI Sky accent — dark mode oklch (matches globals.css). */
  skyDark: "oklch(0.7 0.17 237)",
} as const;

export const spacing = {
  section: "py-16 md:py-24",
  container: "px-6 mx-auto max-w-7xl",
} as const;

export const radii = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
} as const;

export const typography = {
  display: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
  h1: "text-4xl md:text-5xl font-bold tracking-tight",
  h2: "text-3xl md:text-4xl font-semibold tracking-tight",
  h3: "text-2xl md:text-3xl font-semibold",
  h4: "text-xl md:text-2xl font-semibold",
  body: "text-base md:text-lg leading-relaxed",
  small: "text-sm text-default-600",
  eyebrow: "text-xs uppercase tracking-[0.2em] font-medium text-default-500",
} as const;
