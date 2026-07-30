---
applyTo: "**/*.{ts,tsx}"
---

# `<phantom-ui>` Web Component rules

The site uses `@aejkatappaja/phantom-ui` (Lit Web Component, MIT) as
the standard solution for loading skeletons. **Always prefer it over
hand-rolled `<div className="animate-pulse" />` blocks** when the
loading state needs to mirror a real layout.

## When to reach for it

- Any `loading.tsx` file (root or segment).
- Any component that toggles a `loading` flag and renders
  data-fetched content (TanStack Query, SWR, useEffect, etc.).
- Lists rendered with `count={n}` while a fetch is in flight.
- Stale-while-revalidate refresh states (use `mode="overlay"`).

## When NOT to reach for it

- Button spinners — use `<Spinner>` from `@heroui/react`.
- Loading a 100% static page that is already server-rendered (no
  shimmer needed, HTML is there on first paint).
- Decorative animation only — `<phantom-ui>` measures DOM, it's not
  a generic animation primitive.
- Wrapping `<Navbar>` or `<Footer>` in skeleton state — those are
  always present.

## Correct usage

```tsx
'use client';  // required: web component uses browser APIs
import { Eyebrow } from '@/components/ui';

<phantom-ui
  animation="shimmer"
  duration={1.5}
  loading
  loading-label="Cargando artículo"   // accessible name
>
  {/* Copy here is the REAL layout — just with placeholder text.
      The ssr.css import in app/layout.tsx hides the text until
      phantom-ui hydrates and overlays shimmer blocks. */}
  <Eyebrow className="mb-3 block" tone="sky">Categoría</Eyebrow>
  <h1>Título</h1>
  <p>Párrafo…</p>
</phantom-ui>
```

## Anti-patterns

```tsx
// ❌ Hand-rolled skeleton — don't do this anymore
<div aria-hidden className="animate-pulse bg-default-200 h-4 w-3/4 rounded" />

// ❌ Wrapper component that mimics phantom-ui
<CardLoading />  // duplicates work, drifts from real layout

// ❌ Loading for server-rendered static content
<phantom-ui loading>
  <h1>{data.title}</h1>   // already in HTML, skeleton adds nothing
</phantom-ui>

// ❌ Forgetting 'use client' in loading.tsx — Web Component breaks
export default function Loading() {
  return <phantom-ui loading>…</phantom-ui>;
}

// ❌ Phantom-ui wrapping the full page chrome
<phantom-ui loading>
  <Navbar />
  <main>{children}</main>
  <Footer />
</phantom-ui>
```

## Setup invariants (already applied)

These must NOT be removed without a replacement:

- `phantom-ui.d.ts` at the project root (JSX type augmentation).
- `import '@aejkatappaja/phantom-ui/ssr.css'` in `app/layout.tsx`
  (pre-hydration CSS — without it, content flashes before
  measurement).
- `'use client'` on every `loading.tsx` that uses the component.

If you need to add a new loading state in a fresh route, copy the
pattern from `app/loading.tsx` or `app/blog/loading.tsx` rather than
inventing a new structure.

## Pair with

- `routes.xxx` for any in-loader links (typed helpers, no inline
  path strings).
- HeroUI v3 components inside the slot — they render normally while
  phantom-ui measures them.
