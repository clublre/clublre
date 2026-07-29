---
applyTo: "**/*.{ts,tsx}"
---

# TypeScript rules for this repo

These are loaded automatically when Copilot touches any `.ts` or `.tsx`
file. They override defaults from Copilot's base model.

## Strict mode is non-negotiable

- `tsconfig.json` has `strict: true` + `noUncheckedIndexedAccess` +
  `noImplicitOverride`.
- Don't add `// @ts-expect-error` or `as any` to silence errors. Fix
  the type properly.
- Don't disable `strict` flags.

## Type-only imports

```ts
// ✅
import { type FC, type ReactNode } from "react";
import type { Metadata } from "next";

// ❌
import { FC, ReactNode } from "react";
```

The `consistent-type-imports` rule enforces this with auto-fix.

## Path aliases

- Use `@/...` for absolute imports inside this repo.
- Never use `../../../`.

```ts
// ✅
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";
import { title } from "@/components/primitives";

// ❌
import { Button } from "../../../node_modules/@heroui/react";
```

## React component types

Prefer `FC` (FunctionComponent) for explicit components, `ReactNode`
for children, `ComponentProps<typeof X>` when extending an existing
component.

```ts
import { type FC, type ReactNode } from "react";

export const Counter: FC = () => { ... };

interface SectionProps {
  children: ReactNode;
  variant?: "default" | "muted";
}
```

## Variants

For styled components with variants, use `tailwind-variants`:

```ts
import { tv, type VariantProps } from "tailwind-variants";

const card = tv({
  base: "rounded-lg border",
  variants: {
    accent: { azul: "before:bg-estu-azul", amarillo: "before:bg-estu-amarillo" },
  },
});

type CardProps = VariantProps<typeof card> & { children: ReactNode };
```

## Next.js Route types

`typedRoutes` is on. Use the `Route` type:

```ts
import type { Route } from "next";

const links: { href: Route; label: string }[] = [
  { href: "/about", label: "About" },
];
```

For fragment URLs (`/#section`), cast explicitly: `"/#section" as Route`.

## ESLint

`no-unused-vars` is on with `argsIgnorePattern: "^_.*?$"`. Prefix
intentionally-unused args with `_`.

```ts
// ✅
arr.map((_idx, item) => item);

// ❌
arr.map((idx, item) => item);
```