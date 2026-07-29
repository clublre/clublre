---
applyTo: "**/*.{css,tsx,ts}"
---

# Tailwind CSS v4 rules

These are loaded automatically when Copilot touches any CSS, TSX, or TS
file with Tailwind classes.

## Config

- Tailwind v4 uses CSS-based config (`@theme` block in
  `styles/globals.css`).
- There is **no** `tailwind.config.js`. Don't recreate one.
- PostCSS config lives in `postcss.config.mjs` (`@tailwindcss/postcss`).

## Tokens

- **Primary** — HeroUI Sky theme. Accent comes from `--accent` /
  `--focus` / `--link` (overridden in `@layer base` in
  `globals.css`). Use the utility `bg-primary` / `text-primary` /
  `border-primary`, or Tailwind built-in `bg-sky-*` / `text-sky-*`.
- **Secondary** — `--color-amarillo` (utility `bg-amarillo`,
  `text-amarillo`). Used as accent / hover only.
- Surfaces: `bg-background`, `bg-surface`, `bg-surface-muted`,
  `border-border`, `text-foreground` — all derived from HeroUI vars.
- Defaults: `text-default-600`, `text-default-500`, `border-default-200`.
- Shadows: `shadow-club`, `shadow-club-lg`.
- Gradients: `gradient-sky`, `gradient-amarillo`, `gradient-radial-sky`.
- Typography: `font-sans`, `font-mono`.

## Adding new tokens

If you need a value that isn't a token yet:

1. Add it to `styles/globals.css` under `@theme` (creates a utility).
2. Add a constant to `config/design-tokens.ts` (for TS code).
3. Use the utility.

```css
/* globals.css */
@theme {
  --color-estu-rojo-500: oklch(0.55 0.22 25);
}
```

```ts
// design-tokens.ts
export const rojo = "#D33F49";
```

```tsx
<div className='bg-estu-rojo-500' />
```

## Don't use arbitrary values

```tsx
// ❌ avoid
<div className="bg-[#0009A0]" />
<div className="p-[13px]" />

// ✅ use tokens or Tailwind defaults
<div className="bg-sky-500" />
<div className="p-3" />
```

## Dark mode

- Tailwind v4 + `next-themes` with `attribute="class"` and
  `defaultTheme="dark"`.
- Tokens that change between light/dark live in `:root` and `.dark` in
  `globals.css`.
- Don't use the `dark:` variant — it relies on `prefers-color-scheme`,
  not on `next-themes`.

```css
:root {
  --background: oklch(1 0 0);
}
.dark {
  --background: oklch(0.13 0.01 270);
}
```

## Layer order in globals.css

1. `@import "tailwindcss"`
2. `@import "@heroui/styles"` (after tailwindcss)
3. `@theme` block
4. `:root` / `.dark` overrides
5. Custom utilities (`@utility`)
6. `@layer base` styles

Don't reorder — import order matters for Tailwind v4.

## Use `cn()` for conditional classes

```tsx
import { cn } from "@/lib/utils";

<button
  className={cn(
    "px-4 py-2 rounded-md",
    isActive && "bg-sky-500 text-white",
    isDisabled && "opacity-50 cursor-not-allowed",
  )}
/>;
```
