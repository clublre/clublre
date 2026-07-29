---
name: add-component
description: Add a new reusable component to the design system, following project conventions.
---

# Add a new component

You are adding a new reusable UI component to the design system. Follow
these steps exactly.

## Before you start

1. **Search first.** Check `components/ui/`, `components/atoms/`,
   `components/molecules/`, `components/organisms/`, and HeroUI v3 —
   does this already exist? If yes, use it.
2. **Read** `BEST-PRACTICES.md` and `AGENTS.md`.

## If it's truly new

1. **Pick a folder (atomic design).**
   - Reusable across pages + interactive state / logic → atom
     (`components/atoms/<Name>.tsx`) or molecule
     (`components/molecules/<Name>.tsx`).
   - Reusable across pages + layout / decorative → UI primitive
     (`components/ui/<Name>.tsx`).
   - Full page section → organism (`components/organisms/<Name>.tsx`).
   - Page-specific → `app/<route>/_components/<Name>.tsx` (underscore
     prefix = private to that route).
2. **Use `cn()` and `tailwind-variants`** for variants. Don't use raw
   `className={...}` ternaries.
3. **Type the props with `VariantProps<typeof component>`** for
   variants.
4. **Tokens only.** No arbitrary values (`bg-[#xxx]`). If you need a
   new color, add it to `styles/globals.css` (`@theme`) and
   `config/design-tokens.ts`.
5. **Server Component by default.** Only add `"use client"` if you
   really need state / effects.
6. **Accessibility.** Aria labels, focus management, keyboard support.
7. **JSDoc** at the top with a one-line purpose.

## Template

```tsx
import type { HTMLAttributes } from "react";

import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

/**
 * <Name> — short purpose.
 *
 * Use for: ...
 * Don't use for: ...
 */
const component = tv({
  base: "...",
  variants: {
    variant: { default: "...", other: "..." },
    size: { sm: "...", md: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export interface NameProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "size">,
    VariantProps<typeof component> {}

export function Name({ className, variant, size, ...props }: NameProps) {
  return (
    <div className={cn(component({ variant, size }), className)} {...props} />
  );
}
```

## After

1. Export in the matching `index.ts` (atoms / molecules / ui /
   organisms).
2. If the component introduces new tokens, update `BEST-PRACTICES.md`.
3. Run `npm run type-check && npm run lint && npm run build`.
4. If the component is used on a page, verify it in the browser.