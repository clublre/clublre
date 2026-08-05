---
applyTo: '**/*.{css,tsx,ts}'
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
- **Secondary** (cobalto) — usar Tailwind built-in `bg-blue-700` /
  `text-blue-700`. No agregar `bg-amarillo` ni nombres custom:
  rompen por auto-referencia en `@theme inline`.
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
export const rojo = '#D33F49';
```

```tsx
<div className="bg-estu-rojo-500" />
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

### Equivalencias canónicas de valores numéricos

Tailwind v4 genera named utilities para `calc(var(--spacing) * N)`.
Usá el nombre en vez de arbitrary values:

| Arbitrary       | Named (v4)  | Equivale a |
| --------------- | ----------- | ---------- |
| `h-[400px]`     | `h-100`     | 25rem      |
| `h-[360px]`     | `h-90`      | 22.5rem    |
| `w-[760px]`     | `w-190`     | 47.5rem    |
| `w-[200px]`     | `w-50`      | 12.5rem    |
| `min-h-[360px]` | `min-h-90`  | 22.5rem    |
| `min-w-[760px]` | `min-w-190` | 47.5rem    |
| `p-[128px]`     | `p-128`     | 32rem      |

Regla: **preferir el named class (`h-100`) sobre el arbitrary value
(`h-[400px]`)**. Si necesitás un valor nuevo, verificar si el
multiplicador existe antes de caer a `h-[XXXpx]`. El formatter
del proyecto (Prettier) los normaliza — si escribís `h-[400px]`, lo
va a convertir a `h-100` eventualmente.

## `!important` modifier — SUFFIX in v4

Tailwind v4 invirtió la sintaxis del `!important` con respecto a v3:

```tsx
// ✅ v4 (este repo): `!` al final, después del valor
<div className="rounded-md! bg-red-500! hover:bg-red-600/50!" />

// ❌ v3 syntax — todavía compila por compatibilidad pero está deprecada
<div className="!rounded-md !bg-red-500 hover:!bg-red-600/50" />
```

Regla: **`!` va al final del utility, no al principio**. Esto es distinto
de cómo lo hacía v3 (donde `!` era prefijo) y es un error fácil de meter
si uno viene de v3 o de conocimiento viejo del framework. Si ves
`!algo-algo` con `!` al principio en código nuevo, corregirlo a `algo!`
antes de commit.

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
import { cn } from '@/lib/utils';

<button
  className={cn(
    'rounded-md px-4 py-2',
    isActive && 'bg-sky-500 text-white',
    isDisabled && 'cursor-not-allowed opacity-50',
  )}
/>;
```
