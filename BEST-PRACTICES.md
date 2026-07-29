# Best Practices — Club LRE

> Documento vivo. Cada decisión arquitectónica del repo está justificada
> acá. Si vas a hacer algo que contradice este doc, primero actualizalo
> (con un PR) y después codea.

---

## Stack (versiones fijadas)

| Capa             | Versión | Por qué                                                            |
| ---------------- | ------- | ------------------------------------------------------------------ |
| **Next.js**      | 16.2+   | App Router estable, Turbopack default, React 19.                   |
| **React**        | 19.x    | `useActionState`, `useOptimistic`, `<Form>`, React Compiler ready. |
| **TypeScript**   | 6.x     | `noUncheckedIndexedAccess`, `noImplicitOverride`, etc.             |
| **HeroUI**       | 3.2+    | API compound, sin Provider, Tailwind v4 native.                    |
| **Tailwind CSS** | 4.3+    | `@theme` en CSS, no JS config.                                     |
| **ESLint**       | 9.x     | Flat config, `eslint-config-next/core-web-vitals`.                 |
| **Node.js**      | 22.21.x | LTS, requerido por HeroUI MCP.                                     |

---

## 1. Next.js App Router

### 1.1 Server Components por defecto

Toda página / layout / componente es **Server Component** salvo que:

- Usa `useState`, `useEffect`, `useRef`, o cualquier hook de React.
- Usa Context de React.
- Usa APIs del browser (`window`, `localStorage`, etc).
- Maneja eventos del DOM (`onClick`, `onChange`, etc) directamente en el componente.

En esos casos: `"use client"` en la primera línea.

> **Regla**: si podés evitar `"use client"`, evitalo. Menos JS al cliente = menos peso.

### 1.2 `typedRoutes`

`next.config.js` tiene `typedRoutes: true`. Esto genera el tipo `Route` que hace que `<Link href="...">` valide en compile-time.

- ✅ `<Link href="/about">` — Route literal.
- ✅ `<Link href={`/blog/${slug}`}>` donde `slug: keyof typeof posts`.
- ⚠️ Fragment-only URLs (`/#actividades`): hay que castear `as Route` porque Next no puede validarlos.
- ❌ `<Link href={dynamicString}>` sin tipo → TS error.

Si necesitás un link externo, usá `<a target="_blank" rel="noopener noreferrer">` directamente.

### 1.3 `optimizePackageImports`

`@heroui/react`, `@heroui/styles`, `react-icons` y `framer-motion` se tree-shakean agresivamente. Importá siempre desde la raíz:

```ts
// ✅ bien
import { Button, Link } from '@heroui/react';
import { FaInstagram } from 'react-icons/fa';

// ❌ evita rutas internas (no son tree-shakables)
import { Button } from '@heroui/react/dist/components/button';
```

### 1.4 Metadata

Usá `Metadata` + `Viewport` exports desde `app/layout.tsx` y desde cada `page.tsx` que tenga metadata específica. HeroUI y Tailwind no afectan esto.

```ts
export const metadata: Metadata = { title: "...", description: "..." };
export const viewport: Viewport = { themeColor: [...] };
```

### 1.5 Route handlers / server actions

Para mutaciones: usá **Server Actions** (`"use server"` en el archivo o función). Para fetching client-side: usá Server Components + cache.

> Por ahora no usamos DB. Cuando agreguemos CMS o auth, las rutas server-side viven en `app/api/*` (route handlers) o son server actions.

### 1.6 Error boundaries

Cada `app/<route>/` tiene su `error.tsx` si tiene fetch de datos. Por ahora solo tenemos el global. **Regla**: cualquier fetch que pueda fallar debe tener su `error.tsx` local.

---

## 2. React 19

### 2.1 React Compiler (cuando esté estable)

`reactCompiler` está comentado en `next.config.js` porque requiere `babel-plugin-react-compiler` instalado. Activar cuando:

1. Se decida agregar el dev-dep.
2. Se verifique que no rompe Server Components.

### 2.2 Nuevas APIs

- **`useActionState`** — para formularios con estado de servidor. Usar en lugar de `useState` + `useTransition`.
- **`useOptimistic`** — para UIs optimistas. Ideal para "me gusta", comentarios, etc.
- **`<Form>` (de React 19)** — form HTML con manejo automático de Server Actions.
- **`use()`** — leer promesas en render. Usar con cuidado; preferir `Suspense`.

### 2.3 Evitar

- ❌ `useMemo` / `useCallback` innecesarios — el React Compiler los hace auto.
- ❌ `forwardRef` — usar `ref` como prop normal.
- ❌ `"use client"` innecesario.

---

## 3. TypeScript 6

### 3.1 Strict flags activos

- `strict: true`
- `noUncheckedIndexedAccess: true` — `arr[0]` es `T | undefined`.
- `noImplicitOverride: true` —子类 deben poner `override`.
- `noFallthroughCasesInSwitch: true`
- `forceConsistentCasingInFileNames: true`
- `allowJs: false` — solo TS, no `.js`.

### 3.2 Path aliases

Usá `@/...` para imports absolutos. El mapping vive en `tsconfig.json`:

```json
"paths": { "@/*": ["./*"] }
```

### 3.3 Tipos de React

Preferí `type` imports:

```ts
import { type FC, type ReactNode } from 'react';
// o
import type { Metadata } from 'next';
```

### 3.4 Props con variantes

Si un componente tiene variantes (estilo HeroUI), usá `tailwind-variants` con `VariantProps<typeof variants>`:

```ts
import { tv, type VariantProps } from "tailwind-variants";

const card = tv({ base: "...", variants: { ... } });
type CardProps = VariantProps<typeof card> & { children: ReactNode };
```

---

## 4. HeroUI v3

### 4.1 Sin Provider

HeroUI v3 **no usa** `<NextUIProvider>`. Solo wrapeá con `next-themes` si necesitás tema.

### 4.2 Componentes disponibles

Usá los siguientes para cosas comunes:

| Necesitás       | Usá                                                                  |
| --------------- | -------------------------------------------------------------------- |
| Botón           | `<Button variant="primary" \| "outline" \| "ghost" \| ...>`          |
| Link externo    | `<Link>` de HeroUI o `<a target="_blank" rel="noopener noreferrer">` |
| Switch / toggle | `<Switch>` con `Switch.Control`, `Switch.Thumb`                      |
| Modal / drawer  | `<Modal>` / `<Drawer>` (compound)                                    |
| Card            | `<Card>` con `Card.Header`, `Card.Body`                              |
| Dropdown menu   | `<Dropdown>` + `Dropdown.Menu`                                       |
| Input           | `<Input>` + `<Input.Group>`                                          |

### 4.3 ¿Y si no hay componente?

Para Navbar / Footer / cosas de layout, preferí **HTML semántico + clases Tailwind** antes que armar un componente custom sobre HeroUI. Ej: `<nav>`, `<header>`, `<footer>` con utility classes.

### 4.4 Compound API

HeroUI v3 usa componentes compound:

```tsx
<Card>
  <Card.Header>...</Card.Header>
  <Card.Body>...</Card.Body>
</Card>
```

NO usar la prop `header` / `body` / `footer` plana.

---

## 5. Tailwind CSS v4

### 5.1 No config JS

Tailwind v4 **no usa `tailwind.config.js`**. Todo está en `globals.css` con `@theme`.

### 5.2 Tokens

Los tokens viven en `styles/globals.css` (`@theme` block) y se espejean en `config/design-tokens.ts` para uso en código TS.

**Regla**: cuando agregás un color o spacing nuevo, **siempre** lo agregás en ambos lugares.

### 5.3 Convenciones de clases

- ✅ `bg-sky-*`, `bg-primary`, `text-default-600` (utility generada por tokens).
- ✅ `shadow-club`, `shadow-club-lg` (custom shadow).
- ✅ `gradient-sky`, `gradient-amarillo`, `gradient-radial-sky`.
- ⚠️ Evitá valores arbitrarios (`bg-[#0009A0]`). Si necesitás un valor, agregá un token.
- ⚠️ Evitá inline styles. Solo `style={{ "--var": value }}` para pasar CSS vars a HeroUI.

### 5.4 Dark mode

Tailwind v4 + `next-themes` con `attribute="class"` y `defaultTheme="dark"`:

- Tokens light/dark viven en `:root` y `.dark` en `globals.css`.
- Usá `bg-background`, `text-foreground`, `bg-surface-muted` que se reescriben según el tema.

---

## 6. next-themes

### 6.1 Config correcta

```tsx
<NextThemesProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
```

- `attribute="class"` — agrega `.dark` al `<html>`. Coincide con Tailwind v4 dark mode (con custom variant).
- `defaultTheme="dark"` — hasta que el usuario cambie.
- `enableSystem` — respeta `prefers-color-scheme`.
- `disableTransitionOnChange` — evita flashes en cambio de tema.

### 6.2 Hydration

HeroUI lee el tema del HTML. No hay mismatch porque HeroUI v3 no usa Provider. Asegurate que `<html suppressHydrationWarning lang="es">` esté en `app/layout.tsx`.

---

## 7. Estructura de archivos — Atomic design

```
app/
  layout.tsx          # Root layout
  page.tsx            # Home
  providers.tsx       # Client providers (next-themes)
  <route>/
    page.tsx          # Ruta
    layout.tsx        # Layout específico (opcional)
components/
  icons.tsx           # Brand SVG icons
  primitives.ts       # tailwind-variants helpers (title, subtitle)
  atoms/              # Single-purpose, no state
    IconButton.tsx    # HeroUI Button isIconOnly + aria-label
    index.ts
  molecules/          # atoms + state/logic
    ThemeToggle.tsx   # IconButton + next-themes
    index.ts
  organisms/          # Full sections
    Navbar.tsx
    Footer.tsx
  ui/                 # Layout & decorative primitives
    Section.tsx
    Container.tsx
    Eyebrow.tsx
    CardClub.tsx
    BlurryBlob.tsx
    index.ts
config/
  site.ts             # Nav, links, metadata
  design-tokens.ts    # Tokens TS espejados de globals.css
  fonts.ts            # next/font config
styles/
  globals.css         # @import tailwindcss + @import @heroui/styles + @theme
public/
  llms.txt            # AI agent context
```

### Reglas

- **Atomic design** — respetá la jerarquía: atom → molecule → organism.
  No poner UI reusable en la raíz de `components/`.
- **UI primitives en `components/ui/`** — Section, Container, CardClub,
  Eyebrow, BlurryBlob. No en `patterns/` (legacy).
- **Atoms en `components/atoms/`** — IconButton. Son stateless y wrappean
  primitivos de HeroUI.
- **Molecules en `components/molecules/`** — ThemeToggle. Combinan atoms
  con state (next-themes, useState, etc).
- **Organisms en `components/organisms/`** — Navbar, Footer. Secciones
  completas de la página.
- **Tokens en `config/`** — no hardcodear colores / spacing en componentes.
- **`@/` aliases** — siempre.

---

## 7.5 Dev server — workflow

**Regla de oro**: el dev server se deja corriendo entre cambios.
Turbopack hace HMR perfecto sobre:

- Cualquier `.tsx` / `.ts` / `.css` — recargado en caliente.
- Cambios en `components/`, `app/`, `config/`, `lib/`.
- Cambios en `styles/globals.css` — recompila CSS.

**Cuándo SÍ reiniciar el dev server** (raro, ~5% de los casos):

- Cambio en `package.json` o `next.config.js`.
- Cambio en `tailwind.config.js` / `postcss.config.mjs`.
- Cambio en `.env*` o variables de entorno.
- Errores de compilación que persistan tras varios HMR.
- El puerto 3000 quedó en TIME_WAIT o zombie process.

**No** mates el dev server manualmente (`pkill`, `kill <pid>`)
entre cambios pequeños — eso deja zombies + cache corrupto y la
próxima arrancada puede tardar minutos o usar el puerto equivocado.

### Scripts disponibles

```bash
npm run dev          # arrancar el dev server (dejarlo corriendo)
npm run dev:turbo    # alias explícito (Turbopack es el default en Next 16)
npm run dev:clean          # matar zombies + wipe .next/cache + .next/dev
npm run dev:clean -- restart  # idem + arrancar dev server de nuevo
```

### Qué hace `npm run dev:clean`

1. Mata procesos zombis: `next dev`, `next-server`, `next-build`,
   `next-devtools-mcp`.
2. Libera puertos 3000, 3001, 3002 si están ocupados.
3. Borra `.next/cache`, `.next/dev`, `.next/server`, `.next/static`,
   `.next/types`, `node_modules/.cache`.
4. (Opcional) Arranca `next dev` en background.

Si el dev server se comporta raro, corré `npm run dev:clean -- restart`
y volvé a probar.

---

## 7.6 `codebase-memory-mcp` — opcional, recomendado

[`codebase-memory-mcp`](https://github.com/DeusData/codebase-memory-mcp)
es un **MCP server real** que indexa el codebase en un knowledge graph
persistente y expone tools estructurales (call paths, architecture,
search, dead code, Cypher queries) directamente al AI agent. 120× menos
tokens que hacer grep/read manual.

Ya está configurado en `.vscode/mcp.json` y en `~/Library/Application
Support/Code/User/mcp.json` (global). Aparece en el selector de MCP
servers como `codebase-memory-mcp`.

### Tools disponibles (vía MCP)

| Tool | Qué hace |
|---|---|
| `index_repository` | Indexa un repo en el knowledge graph. |
| `search_graph` | Búsqueda estructural por label, name pattern, degree. |
| `trace_call_path` | BFS de call graph in/out (depth 1-5). |
| `get_architecture` | Overview: lenguajes, packages, routes, hotspots. |
| `detect_changes` | Mapea git diff a symbols afectados + blast radius. |
| `query_graph` | Ejecuta queries Cypher-like (read-only). |
| `get_code_snippet` | Lee código por qualified name. |
| `search_code` | Grep en archivos indexados. |
| `manage_adr` | CRUD para Architecture Decision Records. |
| `list_projects` / `index_status` / `delete_project` | Lifecycle. |

### Setup

```bash
# One-time: el binario se descarga automáticamente al instalar
npm install -g codebase-memory-mcp

# Por proyecto: configurar agentes (Claude Code, GitHub Copilot, etc.)
codebase-memory-mcp install

# Indexar el repo actual (lo hace el MCP server automáticamente al
# primer connect, pero se puede forzar):
codebase-memory-mcp cli index_repository --repo-path .
```

El knowledge graph persiste en `~/.cache/codebase-memory-mcp/` (default)
o en `<repo>/.codebase-memory/` (configurado vía env var).

### Cuándo NO usarlo

- En sessions cortas sin modificaciones estructurales, el contexto
  de `.github/instructions/*.instructions.md` + `AGENTS.md` es
  suficiente.
- Para preguntas simples de búsqueda, `grep` + `search_code` MCP
  son suficientes.

### Por qué `.codebase-memory/` está en `.gitignore`

El cache de SQLite (~50-200MB) es personal y se regenera localmente
con `index_repository`. Cada developer lo regenera. No es parte del
repositorio.

### Indexar el repo (one-time setup)

Después de instalar el MCP, **indexar el proyecto manualmente** la
primera vez para construir el knowledge graph:

```bash
codebase-memory-mcp cli index_repository --repo-path .
```

Output esperado:

```json
{"project":"Users-ezequielrivas-Repos-clublre","nodes":379,"edges":548,"status":"indexed"}
```

El AI agent lo invoca automáticamente al primer connect, pero hacerlo
manualmente:

- Acelera la primera query.
- Verifica que el binario funciona.
- Permite explorar el graph con `get_architecture`, `search_graph`,
  etc. antes de la primera sesión.

Re-indexar después de cambios estructurales grandes (nuevas features,
migraciones, renames):

```bash
codebase-memory-mcp cli index_repository --repo-path .
# Opcional: genera artefacto compartido .codebase-memory/graph.db.zst
# para que el equipo evite re-indexar (commiteable si querés).
```

---

## 7.7 `sequential-thinking` MCP — opcional

[`@modelcontextprotocol/server-sequential-thinking`](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)
es un MCP server oficial de Anthropic que provee un tool
`sequential_thinking` para chain-of-thought reasoning paso a paso.
Útil cuando el AI agent necesita descomponer problemas complejos
en pasos numerados antes de actuar.

Ya está configurado en `.vscode/mcp.json` y en `~/Library/Application
Support/Code/User/mcp.json`.

**Cuándo usarlo**: debugging multi-paso, migraciones grandes, refactors
cross-cutting. El agent decide cuándo invocarlo — no requiere acción
manual.

---

## 8. Accesibilidad (a11y)

### 8.1 Mínimo obligatorio

- ✅ Cada `<img>` con `alt`.
- ✅ Cada `<button>` sin texto tiene `aria-label`.
- ✅ Headings jerárquicos (h1 → h2 → h3, sin saltar niveles).
- ✅ Focus visible (`:focus-visible` ya está en globals.css).
- ✅ Color contrast ratio 4.5:1 mínimo.
- ✅ `lang="es"` en `<html>` (configurado en layout).

### 8.2 Formularios

Cada `<input>` con `<label>` asociado (vía `htmlFor` o wrapping). HeroUI `<Input>` lo hace automáticamente.

### 8.3 Iconos interactivos

Iconos como botón necesitan `aria-label`:

```tsx
<button aria-label="Cerrar menú" onClick={...}>
  <FaTimes />
</button>
```

---

## 9. Performance

### 9.1 Imágenes

- ✅ Usá `<Image>` de Next, no `<img>`.
- ✅ `priority` solo above-the-fold.
- ✅ Tamaños definidos (`width`, `height` o `fill`).

### 9.2 Fonts

next/font/google (ya configurado en `config/fonts.ts`). No importes fuentes en CSS.

### 9.3 JS al cliente

- ❌ Evitá `"use client"` salvo necesidad real.
- ❌ No importes `framer-motion` directo — HeroUI lo hace lazy si es necesario.
- ❌ No uses `useEffect` para cosas que pueden ser server-side.

### 9.4 Imágenes OG y metadata

Cada page debe exportar `metadata` y `viewport`. Para OG dinámico usá `generateMetadata`.

---

## 10. Git & commits

### 10.1 Convención de commits

[Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` bug fix
- `chore:` tooling, deps, sin cambio de comportamiento
- `refactor:` cambio interno sin nueva funcionalidad
- `docs:` solo documentación
- `style:` formato sin cambio lógico
- `test:` tests
- `perf:` performance

### 10.2 Branching

- `main` — producción
- `feat/<name>` — features
- `fix/<name>` — fixes
- `chore/<name>` — tooling

### 10.3 Pre-commit

Antes de commit:

```bash
npm run type-check && npm run lint
```

---

## 11. AI agents (gobernanza)

Ver [`AGENTS.md`](./AGENTS.md) y [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) para las reglas que cualquier AI agent (Copilot, Cursor, etc.) debe seguir en este repo.
