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
5. **Use patterns from `components/patterns/`** before creating new
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
  navbar.tsx            # Top navigation
  footer.tsx            # Site footer
  theme-switch.tsx      # Light/dark toggle (HeroUI Switch + next-themes)
  icons.tsx             # Brand SVG icons
  patterns/             # Design system primitives (Section, Container,
                        # CardClub, Eyebrow, BlurryBlob)
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
  `@accent`), `bg-amarillo` (secondary), `gradient-sky`,
  `shadow-club`, `shadow-club-lg`.
- ❌ No inline `style={{ color: '#...' }}`. Use utility classes.
- ❌ No `bg-[#abc]` arbitrary values — add a token to `globals.css` and
  `design-tokens.ts` instead.

### 3. Components & patterns

- ✅ Page sections use `<Section>` + `<Container>` from
  `@/components/patterns`.
- ✅ Brand cards use `<CardClub>` (with `accent` / `highlighted`).
- ✅ Buttons: HeroUI `<Button>` with `variant="primary" | "outline" |
"ghost" | ...`. Never hand-roll a styled `<button>` unless it's a
  semantic toggle (e.g. theme switch).
- ❌ Don't recreate components that already exist in HeroUI v3.

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

- JSDoc only for non-obvious APIs, exported helpers, or component
  variants.
- No "what" comments (`// loop through items`). Comments explain "why".
- Use Spanish for user-facing copy, English for code/comments.

### File headers

Every file should have a one-line top-level comment if its purpose isn't
obvious from the name. Example:

```ts
// Theme-aware navbar — uses next-themes for dark mode toggling.
```

---

## What NOT to do

1. Don't add a new dependency without confirming it works with
   React 19 + Next 16.
2. Don't refactor `components/patterns/*` without updating
   `BEST-PRACTICES.md`.
3. Don't add `// eslint-disable` without a one-line reason comment.
4. Don't add console.logs. Use `console.warn` / `console.error` only.
5. Don't create duplicate type definitions. Extend from
   `config/design-tokens.ts` if applicable.
6. Don't disable `strict` flags in `tsconfig.json` to fix a build
   error. Fix the actual type error.
7. Don't change the `--color-estu-*` palette without consulting the
   club (these are the brand colors).

---

## Verification checklist (before declaring a task done)

```bash
npm run type-check     # tsc --noEmit
npm run lint           # eslint .
npm run build          # next build (catches SSR/RSC issues)
```

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
- `.github/agents/*.agent.md` — specialised agent personas.
