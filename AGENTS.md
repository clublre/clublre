# AGENTS.md — Club LRE

> **Audience**: any AI coding agent (GitHub Copilot, Cursor, Claude Code,
> Windsurf, Cline, etc.) that modifies code in this repo. If you're a
> human contributor, this still applies, but the prose is written for LLMs.

This is the canonical governance document for AI agents working on Club
LRE. It is loaded automatically by Copilot, Cursor, and most MCP-aware
agents. If a more specific `.github/instructions/*.instructions.md` or
`.github/agents/*.agent.md` exists, the more specific file wins.

---

## TL;DR — non-negotiables

1. **Stack is fixed.** Next 16 App Router · React 19 · HeroUI v3 ·
   Tailwind v4 · TypeScript 6 · Node 22.21.x. Do not propose alternatives.
2. **Server Components by default.** Add `"use client"` only when truly
   needed.
3. **HeroUI v3 has no `<Provider>`.** Do not reintroduce NextUIProvider.
4. **Tokens live in two places, kept in sync:**
   `styles/globals.css` (`@theme` block) + `config/design-tokens.ts`.
5. **Use primitives from `components/ui/`** before creating new
   components. New reusable UI goes there, not in `components/`.
6. **Run `npm run type-check && npm run lint` before declaring done.**
7. **Do not commit secrets, `.env*`, or `node_modules`.**
8. **Do not introduce new dependencies without checking HeroUI / Next 16
   compatibility first.**

---

## Repo map

```
app/                    # Next 16 App Router. Each route is a folder.
  layout.tsx            # Root layout (Navbar + Footer + Providers)
  providers.tsx         # Client providers wrapper (next-themes)
  page.tsx              # Home (hero, actividades, CTA)
  about/                # About + comisión
  blog/
    page.tsx            # Blog index
    [slug]/page.tsx     # Dynamic post page (typedRoutes-friendly)
  pricing/              # Cuotas
  error.tsx             # Global error boundary
components/
  icons.tsx             # Brand SVG icons
  primitives.ts         # tailwind-variants helpers (title, subtitle)
  counter.tsx           # Demo Button (not part of the design system)
  atoms/                # Atomic design — atoms (small, single-purpose)
    IconButton.tsx      # HeroUI Button with isIconOnly + aria-label
  molecules/            # Atomic design — molecules (atoms + state/logic)
    ThemeToggle.tsx     # IconButton + next-themes (sun/moon)
  organisms/            # Atomic design — organisms (full sections)
    Navbar.tsx          # Top navigation
    Footer.tsx          # Site footer
  ui/                   # UI primitives — layout & decorative patterns
    Section.tsx         # Semantic page section wrapper
    Container.tsx       # Fixed max-width wrapper
    Eyebrow.tsx         # Small uppercase label above a heading
    CardClub.tsx        # Branded card with optional accent stripe
    BlurryBlob.tsx      # Decorative animated blobs
config/
  site.ts               # Site metadata, navItems, links
  design-tokens.ts      # TS mirror of CSS @theme tokens
  fonts.ts              # next/font config (Inter, Fira Code)
lib/
  utils.ts              # `cn()` helper (clsx + tailwind-merge)
styles/
  globals.css           # @import tailwindcss + @heroui/styles + @theme
public/
  llms.txt              # AI agent context
BEST-PRACTICES.md       # The architectural bible — read it first
```

---

## Hard rules

### 1. Imports & components

- ✅ Use `@/...` aliases (configured in `tsconfig.json`).
- ✅ Import HeroUI components from `@heroui/react` only.
- ✅ Import icons from `react-icons/<set>` (e.g. `react-icons/fa`).
- ❌ Don't deep-import HeroUI internals (`@heroui/react/dist/...`).
- ❌ Don't reintroduce `@nextui-org/*` packages.

### 2. Styling

- ✅ Use Tailwind utility classes generated from tokens.
- ✅ Brand tokens: `bg-sky-*` / `text-primary` (HeroUI Sky theme via
  `@accent`), `bg-blue-*` (cobalto secundario), `gradient-sky`,
  `shadow-club`, `shadow-club-lg`.
- ✅ **Prefer Tailwind built-in palettes** (`bg-sky-500`,
  `bg-blue-700`) por sobre nombres custom de la marca. Si necesitás
  un valor fuera de la paleta, agregalo a `globals.css` (`@theme`) +
  `config/design-tokens.ts` y usá el utility generado.
- ❌ Nombres custom como `bg-amarillo` / `bg-cobalt` están
  **deprecated** — pueden romper por bugs de auto-referencia en
  `@theme inline`. Migrar a Tailwind built-in o al token equivalente
  ya definido.
- ❌ No inline `style={{ color: '#...' }}`. Use utility classes.
- ❌ No `bg-[#abc]` arbitrary values — add a token to `globals.css` and
  `design-tokens.ts` instead.

### 3. Components — Atomic design

Components live under `components/` classified by atomic-design
level. **New shared components go in the right bucket — not in the
root.**

| Level         | Folder             | Example                                                     | Rule of thumb                                                                                       |
| ------------- | ------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **atoms**     | `atoms/`           | `IconButton`                                                | Single-purpose, no state. Wraps a HeroUI primitive.                                                 |
| **molecules** | `molecules/`       | `ThemeToggle`                                               | Atom + state/logic (e.g. `next-themes`).                                                            |
| **organisms** | `organisms/`       | `Navbar`, `Footer`                                          | Full chrome sections shared across routes.                                                          |
| **ui**        | `ui/`              | `Section`, `Container`, `CardClub`, `Eyebrow`, `BlurryBlob` | Layout / decorative primitives shared across pages.                                                 |
| **pages**     | `pages/{feature}/` | `pages/home/Hero`, `pages/pricing/PricingCard`              | Page-specific sections. One folder per route/feature. Composition root for that route's `page.tsx`. |

- ✅ Page sections use `<Section>` + `<Container>` from
  `@/components/ui`.
- ✅ Brand cards use `<CardClub>` (with `accent` / `highlighted`).
- ✅ Icon-only buttons use `<IconButton>` from `@/components/atoms`.
- ✅ Light/dark toggle uses `<ThemeToggle>` from `@/components/molecules`.
- ✅ Buttons: HeroUI `<Button>` with `variant="primary" | "outline" |
"ghost" | ...`. Never hand-roll a styled `<button>` unless it's a
  semantic toggle (e.g. menu hamburger).
- ❌ Don't recreate components that already exist in HeroUI v3.
- ❌ Don't put shared components at the root of `components/`.

### 4. Forms & interactivity

- ✅ Use HeroUI `<Input>`, `<TextArea>`, `<Select>`, `<Switch>`,
  `<Checkbox>`, `<RadioGroup>`.
- ✅ For form state, prefer React 19 `useActionState` when a server
  action is available.
- ✅ Optimistic UI: `useOptimistic` from React 19.

### 5. Types

- ✅ Strict TS — `noUncheckedIndexedAccess` is on. `arr[0]` is `T |
undefined`.
- ✅ `import type` for type-only imports.
- ✅ `Route` from `next` for `<Link href>` values.
- ❌ No `any`. If you must escape, prefer `unknown` + narrowing.

### 6. Accessibility

- ✅ All interactive icons have `aria-label`.
- ✅ All images have `alt`.
- ✅ Heading hierarchy: h1 → h2 → h3, no skipping.
- ✅ Form fields have associated labels.
- ✅ Focus styles are in `globals.css` — don't remove them.

---

## Soft rules (style preferences)

### Code style

- Use `cn()` (`@/lib/utils`) for conditional class strings.
- Prefer arrow functions for components; `function` only for hooks or
  helper utilities.
- Component files: `PascalCase.tsx`. Utilities: `camelCase.ts`.
- Keep components under ~200 lines; split when larger.

### Comments

- JSDoc breve (1–2 líneas) solo para APIs exportadas, helpers
  públicos o variantes de componentes.
- Comentarios inline solo cuando explican **por qué** algo no obvio
  (workaround, quirk, decisión de diseño). Nunca "qué" hace el
  código.
- **Idioma**: comentarios, JSDoc y headers de archivo van en
  **español**. Nombres de variables / props / tipos / strings de UI
  en inglés (es lo que entiende el ecosistema).
- Sin código comentado (HTML/JSX) — borrar, no dejar `<!-- … -->`.
- Sin bloque JSDoc multi-párrafo justificando cada decisión —
  mantener el bloque escueto.

### File headers

Una sola línea arriba si el propósito no es obvio del nombre. Ej:

```ts
// Theme-aware navbar — uses next-themes for dark mode toggling.
```

---

## What NOT to do

1. Don't add a new dependency without confirming it works with
   React 19 + Next 16.
2. Don't refactor `components/ui/*` without updating
   `BEST-PRACTICES.md`.
3. Don't add `// eslint-disable` without a one-line reason comment.
4. Don't add console.logs. Use `console.warn` / `console.error` only.
5. Don't create duplicate type definitions. Extend from
   `config/design-tokens.ts` if applicable.
6. Don't disable `strict` flags in `tsconfig.json` to fix a build
   error. Fix the actual type error.
7. Don't change the `--color-estu-*` palette without consulting the
   club (these are the brand colors).
8. **Don't commit or push without explicit user authorization.**
   Frases como "dale", "ok", "listo" no son autorizaciones — son
   acknowledgment. Pedir confirmación antes de `git commit` /
   `git push` si el usuario no lo pidió explícito.
9. **Don't run lint/type-check on every change by default.** Solo
   cuando el usuario lo pide, en handoff, o cuando el cambio es
   high-risk (refactor cross-cutting, upgrade de deps, etc).

## Validation cadence

Por default: editar + commitear sin correr `npm run lint` /
`npm run type-check` en cada cambio. Razones:

- Iteración más rápida cuando se hacen muchos cambios chicos.
- ESLint puede tener falsos positivos que distraen.

Cuándo SÍ correr validaciones:

- Antes de un handoff (PR, pedir review).
- Después de cambios high-risk (refactor cross-cutting, upgrade de
  deps, tocar `tsconfig.json` / `next.config.js`).
- Cuando el usuario lo pide explícito.

Si el build de producción falla, ahí sí — `npm run build`.

---

## Verification checklist (before declaring a task done)

```bash
npm run type-check     # tsc --noEmit
npm run lint           # eslint .
npm run build          # next build (catches SSR/RSC issues)
```

> Solo correr si el usuario lo pide o en handoff. No es parte del
> flujo por default — ver §"Validation cadence" arriba.

If a UI change, also smoke-test in browser via `npm run dev`.

---

## When you're stuck

1. Read `BEST-PRACTICES.md` (architectural rationale).
2. Read `public/llms.txt` (project context).
3. Check HeroUI MCP (`heroui-react` is configured in `.vscode/mcp.json`)
   for component API questions.
4. Check Next.js MCP (`next-devtools` is configured) for App Router
   patterns.
5. Ask the user — don't guess architectural decisions.

---

## See also

- `BEST-PRACTICES.md` — full architectural guide.
- `.github/copilot-instructions.md` — Copilot-specific additions.
- `.github/instructions/*.instructions.md` — scoped rules per area.
  - `taste-skill-coordination.instructions.md` — cómo conviven las reglas de taste-skill con las de este repo.
- `.github/agents/*.agent.md` — specialised agent personas.
