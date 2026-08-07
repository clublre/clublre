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

Plus `app/<route>/loading.tsx` para skeletons segment-scoped —
un skeleton con el mismo tipographic-rhythm que la ruta final
evita CLS durante `generateStaticParams` o revalidaciones.

### 1.7 File-based metadata routes (Next 16)

Tres rutas file-based en `app/` que Next prerendera en build:

- `app/opengraph-image.tsx` → genera `og:image` (1200×630 PNG) con
  `ImageResponse` de `next/og`. Static al build (sin params).
  Pinneado a `runtime = 'nodejs'` porque lee `public/logo2.jpeg`
  vía `node:fs/promises` (Vercel defaultea a Edge y eso rompe).
- `app/icon.tsx` → favicon 32×32.
- `app/apple-icon.tsx` → Apple touch icon 180×180.
  También `runtime = 'nodejs'` por la misma razón.

Las tres leen `public/logo2.jpeg` con `readFile` y la embeben
como `data:image/jpeg;base64,...` para que Satori (el motor
de `next/og`) pueda renderizarla inline. Single source of truth:
si cambia el escudo, se regenera todo en el próximo build.

### 1.8 JSON-LD y `<head>` metadata

`app/layout.tsx` exporta un payload `SportsClub` y lo inyecta como
`<script type="application/ld+json" dangerouslySetInnerHTML>` antes
de `<Providers>`. Google lo usa para rich results (panel del
conocimiento sobre la organización deportiva en SERP).

Datos confirmados via web search 2026-07-29:

- `name`, `alternateName` (CLUB L.R.E)
- `address` PostalAddress completo (Iriondo 375, S2122 Rosario)
- `telephone` (+54 341 435 1273)
- `sameAs` (Instagram)

`app/sitemap.ts` y `app/robots.ts` usan la convención file-based
de Next 16 (`MetadataRoute.Sitemap` / `MetadataRoute.Robots`) —
no hace falta plugin. Publican `/sitemap.xml` y `/robots.txt`
como Static al build.

### 1.9 View Transitions (Next 16)

`experimental.viewTransition: true` habilita la CSS View Transitions
API para navegaciones client-side. Cross-fade de elementos con el
mismo `view-transition-name`.

Cómo aplicar a un nuevo par de páginas:

```tsx
// app/page.tsx (origen)
<h1 style={{ viewTransitionName: 'page-title' }}>...</h1>

// app/destino/page.tsx
<h1 style={{ viewTransitionName: 'page-title' }}>...</h1>
```

Cuando navegás de origen → destino, el browser cross-fadea los
dos `<h1>` mientras el resto de la chrome (Navbar / Footer)
hace swap instantáneo. Sin nombre compartido → fallback a
corte instantáneo en browsers sin soporte (Safari < 18).

Hoy está aplicado a `page-title` en `/`, `/about`, `/pricing`,
`/blog` y `/blog/[slug]`. Próximo: nombrar el logo, los CTAs y
los cards de actividades para cross-fades más ricos entre
home ↔ actividades.

---

## 2. React 19

### 2.1 React Compiler ✅ activo

`reactCompiler: { target: '19' }` está habilitado en `next.config.js` (estable desde React 19). Requiere `babel-plugin-react-compiler` instalado como devDependency. Reglas:

- Las componentes se memoizan automáticamente en el IR — la mayoría de los `useMemo` / `useCallback` manuales ya no son necesarios. Conservar los actuales en `Navbar` y `ThemeToggle` mientras migramos o, idealmente, removerlos cuando verifiquemos que el compiler los cubre.
- Compatible con HeroUI y React Aria Components porque ya declaran renders puros.
- Server Components no se ven afectados — el compiler solo corre sobre boundary "use client".

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
- `noPropertyAccessFromIndexSignature: true` — fuerza `record['key']`
  en vez de `record.key` para tipos con index signature.
  - Acceso a `process.env` pasa a bracket notation:
    `process.env['NEXT_PUBLIC_SENTRY_DSN']`.
  - Records con keys literales (`as const satisfies Record<...>`) se
    pueden seguir usando con `obj.key` después de tipar.

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

Los tokens viven en `styles/globals.css` (`@theme` block) y se espejean en `config/design-tokens.ts` para uso en código TS. **Domain data** (activities, commission, pricing tiers, blog posts) vive en `data/` y se reemplaza por un CMS en producción — no se mezcla con los tokens visuales.

Tokens actuales:

- `--accent` (HeroUI Sky) — `bg-primary`, `text-primary`.
- `--color-sky-soft` / `--color-sky-soft-fg` — chips, pills, categorías.
- `--color-default-100` … `--color-default-700` — escala de texto neutro.
  Es una mezcla del foreground con opacidad, no una rampa monotónica.

> **Cobalto (secondary)** — no se agrega como token custom. Usar
> directamente Tailwind built-in `bg-blue-700` / `text-blue-700`. El
> viejo `--color-amarillo` / `--color-amarillo-soft` está deprecated
> (rompe por auto-referencia en `@theme inline`; ver §5.3).

### 5.3 Convenciones de clases

- ✅ `bg-sky-*`, `bg-primary`, `text-default-600` (utility generada por tokens).
- ✅ `shadow-club`, `shadow-club-lg` (custom shadow).
- ✅ `gradient-sky`, `gradient-amarillo`, `gradient-radial-sky`.
- ✅ **Preferir Tailwind built-in** (`bg-blue-700`, `bg-cyan-500`) por
  sobre nombres custom. Si necesitás un valor fuera de la paleta,
  agregá un token a `@theme` + `config/design-tokens.ts`.
- ❌ **`bg-amarillo` / `bg-cobalt`** están deprecated. Pueden romper
  por bugs de auto-referencia en `@theme inline` (ya pasó: `bg-amarillo/10`
  rendereaba negro). Usar Tailwind built-in equivalente.
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
    SectionHeader.tsx
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

| Tool                                                | Qué hace                                              |
| --------------------------------------------------- | ----------------------------------------------------- |
| `index_repository`                                  | Indexa un repo en el knowledge graph.                 |
| `search_graph`                                      | Búsqueda estructural por label, name pattern, degree. |
| `trace_call_path`                                   | BFS de call graph in/out (depth 1-5).                 |
| `get_architecture`                                  | Overview: lenguajes, packages, routes, hotspots.      |
| `detect_changes`                                    | Mapea git diff a symbols afectados + blast radius.    |
| `query_graph`                                       | Ejecuta queries Cypher-like (read-only).              |
| `get_code_snippet`                                  | Lee código por qualified name.                        |
| `search_code`                                       | Grep en archivos indexados.                           |
| `manage_adr`                                        | CRUD para Architecture Decision Records.              |
| `list_projects` / `index_status` / `delete_project` | Lifecycle.                                            |

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
{
  "project": "Users-ezequielrivas-Repos-clublre",
  "nodes": 379,
  "edges": 548,
  "status": "indexed"
}
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

## 7.8 Agent skills — opcionales, recomendadas

Además de los MCP servers, hay **agent skills** ([`skills`](https://github.com/vercel-labs/skills),
npm: `skills@1.5.x`) que extienden el comportamiento del AI agent
con instrucciones y scripts especializados. Son equivalentes a
`AGENTS.md` + scripts ejecutables, versionados en repos externos
e instalables con un solo comando.

### Skills recomendadas para este stack

| Skill                             | Fuente                                                 | Para qué                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **`web-design-guidelines`**       | `vercel-labs/agent-skills@web-design-guidelines`       | Review de UI/UX contra Web Interface Guidelines de Vercel. Útil cuando pedís "revisar mi UI" / "audit design" / "check accessibility".          |
| **`vercel-react-best-practices`** | `vercel-labs/agent-skills@vercel-react-best-practices` | Performance optimization para React/Next.js desde Vercel Engineering. Triggers en refactors de componentes, data fetching, bundle optimization. |
| **`vercel-composition-patterns`** | `vercel-labs/agent-skills@vercel-composition-patterns` | Compound components, render props, context providers. React 19 API changes. Aplicable a nuestro atomic design y al uso de HeroUI compound.      |
| **`heroui-react`** ⭐             | `heroui-inc/heroui@heroui-react`                       | Skill oficial de HeroUI v3 React. Cubre instalación, theming con oklch, dark/light, todos los componentes. La más importante para nosotros.     |

### Instalación

```bash
# Una vez, con Node 22+:
npx -y skills@1.5.18 add heroui-inc/heroui@heroui-react -y
npx -y skills@1.5.18 add 'vercel-labs/agent-skills@web-design-guidelines' -y
npx -y skills@1.5.18 add 'vercel-labs/agent-skills@vercel-react-best-practices' -y
npx -y skills@1.5.18 add 'vercel-labs/agent-skills@vercel-composition-patterns' -y
```

El CLI detecta qué agentes tenés instalados (GitHub Copilot en
nuestro caso) y los instala en `.agents/skills/`. Cada agente
descubre las skills vía sus directorios estándar
(`.agents/skills/`, `.claude/skills/`, etc.).

### Listar / remover / actualizar

```bash
npx skills list                 # qué hay instalado
npx skills find <query>        # buscar en skills.sh
npx skills update              # actualizar todo
npx skills remove <name>        # sacar una
```

### Por qué no están commiteadas

Cada dev tiene su propio subset de skills. `.agents/`, `.claude/`,
`.cursor/`, `.windsurf/` están en `.gitignore`. El dev las
instala una vez y quedan locales.

### Cuándo NO instalarlas

- Si solo vas a hacer commits chicos sin interacción con el agent,
  las skills no aportan mucho.
- Si el agent no detecta skills automáticamente (algunos
  editores requieren config manual en `.vscode/settings.json`).

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

### 9.4 Bundle analysis

`npm run analyze` corre `next build && next experimental-analyze -o`.
Output en `.next/diagnostics/analyze/index.html` (sin servidor) o
levanta UI interactiva en `localhost:4000` si removés el `-o`.

Útil cuando:

- Agregás una dep nueva — ver cuánto pesa en el bundle.
- Después de un upgrade mayor de Next/React/HeroUI.
- Sospecha de regresión (cliente bundle creciendo sin razón).

### 9.5 Imágenes OG y metadata

Cada page debe exportar `metadata` y `viewport`. Para OG dinámico usá `generateMetadata`.

Los assets visuales (OG image, favicons) viven como file-based routes
— ver §1.7.

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

Antes de commit (solo si el usuario lo pide — ver §5.3 / AGENTS.md
"Validation cadence"):

```bash
npm run type-check && npm run lint
```

Por default no se corren validaciones en cada cambio. Sí se corren
en handoff o cuando el cambio es high-risk.

---

## 11. AI agents (gobernanza)

Ver [`AGENTS.md`](./AGENTS.md) y [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) para las reglas que cualquier AI agent (Copilot, Cursor, etc.) debe seguir en este repo.

---

## 12. Pendientes / Post-MVP

Hay mejoras que **no forman parte del MVP** pero quedan registradas
para iteraciones futuras. Cada item incluye: contexto, motivación,
stack propuesto y esfuerzo estimado. No abrir PRs hasta que se
defina un milestone.

> **Estado al 2026-07-30:** §12.1 (tests) y §12.2 (Storybook) están
> **pospuestos por decisión del equipo**. La info del stack y el
> esfuerzo estimado se conserva como referencia futura; cualquier
> reactivaión debe pasar por un milestone explícito. §12.3 sigue
> abierta como brainstorm.

### 12.1 Tests unitarios + integration (Vitest + Testing Library) — 🟡 POSPUESTO

> **Pospuesto.** El sitio es chico, 100% estático, sin auth ni
> endpoints; el ROI de tests automatizados no compensa el setup en
> el corto plazo. Si más adelante se agrega CMS, autenticación de
> socios o formularios de contacto, este item vuelve a la mesa.
> Mientras tanto, las verificaciones manuales son `npm run
type-check && npm run lint` antes de cada handoff.

**Por qué ahora no:** el sitio es 100% estático (`output: "export"`
en `next.config.js`), sin endpoints, sin auth, sin estado
compartido. La superficie a testear es:

- 5 componentes UI (`Section`, `Container`, `CardClub`, `Eyebrow`,
  `BlurryBlob`)
- 2 organisms (`Navbar`, `Footer`)
- 1 molecule (`ThemeToggle`)
- 1 atom (`IconButton`)
- Helpers de `lib/utils` (`cn`)

**Stack propuesto:**

| Dependencia                   | Para qué                                  |
| ----------------------------- | ----------------------------------------- |
| `vitest`                      | test runner compatible con TS + ESM       |
| `@vitejs/plugin-react`        | soporte React 19                          |
| `@testing-library/react`      | render + queries semánticas               |
| `@testing-library/jest-dom`   | matchers (`toBeInTheDocument`, etc.)      |
| `@testing-library/user-event` | interacciones realistas (`click`, `type`) |
| `happy-dom`                   | entorno DOM rápido (más veloz que jsdom)  |
| `axe-core` + `vitest-axe`     | smoke tests de a11y por componente        |

**Estructura:**

```text
__tests__/
  components/
    ui/
      Section.test.tsx
      Container.test.tsx
      Eyebrow.test.tsx
    atoms/
      IconButton.test.tsx
    molecules/
      ThemeToggle.test.tsx
    organisms/
      Navbar.test.tsx
      Footer.test.tsx
  lib/
    utils.test.ts
vitest.config.ts
vitest.setup.ts
```

**Casos críticos a cubrir:**

1. `Navbar` — `aria-current="page"` cuando el `pathname` coincide con
   `item.href` (fragmentos excluidos).
2. `ThemeToggle` — flippea clase `dark` en `<html>` y persiste en
   `localStorage`.
3. `Section` / `Container` / `Eyebrow` — `defaultVariants` aplicados
   sin necesidad de props.
4. `IconButton` — exige `aria-label` (debería fallar el build con
   un wrapper que lo enforza).
5. `cn` — combinación correcta con `tailwind-merge` (clases
   conflictivas se colapsan).
6. a11y — `vitest-axe` en cada organism principal.

**Esfuerzo estimado:** 1 sprint (3–5 días).

### 12.2 Storybook (visual docs + Chromatic) — 🟡 POSPUESTO

> **Pospuesto.** La superficie UI es pequeña (Navbar, Footer,
> SectionHeader, CardClub). Storybook paga su costo de setup cuando
> hay muchos organismos y variantes; hoy el catálogo es manejable
> desde el dev server. Si la superficie crece (>10 organismos o
> variantes por componente), este item vuelve a la mesa.

**Por qué ahora no:** todo el UI es estático y los organismos son
pocos (Navbar, Footer). Cuando crezca la superficie (blog index,
filtros, formularios de contacto, login de socios), Storybook paga
su costo de setup.

**Stack propuesto:**

| Dependencia                | Versión                         |
| -------------------------- | ------------------------------- |
| `storybook`                | 8.x                             |
| `@storybook/nextjs-vite`   | 8.x (compatible Next 16 + Vite) |
| `@chromatic-com/storybook` | visual regression               |
| `@storybook/addon-a11y`    | axe in-browser                  |
| `@storybook/addon-themes`  | toggle sky/dark                 |

**Configuración recomendada:**

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  framework: { name: '@storybook/nextjs-vite', options: {} },
  stories: ['../components/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  staticDirs: ['../public'],
};
```

**Convenciones de story:**

- `CSF3` (Component Story Format 3) — funciones exportadas, `args`
  declarativos.
- Cada componente UI expone todas las variantes (`<Section>` →
  `Default`, `Muted`, `Gradient`, `Transparent`).
- `play()` para interacciones (`userEvent.click` en `Navbar.mobile`).
- Chromatic en CI con umbral de diff < 0.1%.

**Esfuerzo estimado:** 2 sprints (setup + stories base) + 1 sprint
de Chromatic.

### 12.3 Otras mejoras registradas (no priorizadas)

- **PWA** (`next-pwa` o Workbox manual) — instalable en Android/iOS.
- **i18n completo** (`next-intl`) — actualmente el sitio es es-AR
  hardcodeado; si se abre a otros países, formalizar.
- **CMS headless** (Sanity, Contentful o MDX remoto) para que la
  comisión pueda postear sin tocar el repo.
- **Analytics** — Plausible o Umami (RGPD-friendly, cookie-less).
- **Forms backend** — contacto y pre-inscripción. Resend + React
  Email es la opción más liviana.

> ⚠️ **Error tracking**: en revisión. Se removió Sentry (commit `b211644`) — Vercel logs + log drain a Slack cubren el 99% del valor sin el costo. Re-evaluar en fase 2 si el volumen lo justifica.

---

## 13. Production hardening

Una vez que el sitio entra a `clublre.com.ar` (o el dominio que
definas), esta checklist queda activa:

### 13.1 Security headers (CSP + HSTS + friends) — ✅ aplicado

`next.config.js` define un array `securityHeaders` y el hook
`async headers()` los aplica a `/:path*`. Reglas:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  — 2 años. HSTS preload list submission: <https://hstspreload.org>
- `X-Content-Type-Options: nosniff` — bloquea MIME sniffing
- `X-Frame-Options: SAMEORIGIN` — anti-clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — cámara / micrófono / geolocation / payment /
  interest-cohort denegados
- CSP estricta con `default-src 'self'`, `'unsafe-inline'` solo en
  `style-src` / `script-src` (necesario para HeroUI + dev), y
  `frame-ancestors 'none'` como segunda capa anti-clickjacking.

⚠️ Headers NO se aplican en `next dev` (Vercel Live feedback +
HMR + liveness probes rompen con strict CSP). El `headers()`
callback detecta `process.env.NODE_ENV` y devuelve `[]` en dev,
dejándolos activos solo en builds de producción.

### 13.2 Error tracking (Sentry) — ❌ removido

Sentry fue removido en commit `b211644`. Justificación: para un
club con ~1000 socios, Vercel logs + log drain a Slack cubren el
99% del valor de error tracking sin el costo de $26/mes de Sentry.

**Si en el futuro se necesita re-activar** (ej: deploy a producción
con tráfico real, monitoreo de regresiones, alerting):

1. `pnpm add @sentry/nextjs`
2. Recrear `instrumentation.ts` + `sentry.{server,edge,client}.config.ts`
3. Setear `NEXT_PUBLIC_SENTRY_DSN` en Vercel Project Settings
4. Configurar sampling rate (recomendado: `tracesSampleRate: 0.1` en prod)
5. Actualizar `app/error.tsx` para llamar `Sentry.captureException()`

References: `STACK.md §2.7` y §3 para más contexto.

### 13.3 OG image, icons & JSON-LD — ✅ aplicado

Ya cubierto en §1.7 y §1.8. Verificación post-deploy:

```bash
# OG image (debería devolver 200 + Content-Type: image/png)
curl -I https://clublre.com.ar/opengraph-image

# Favicons
curl -I https://clublre.com.ar/icon          # 32×32
curl -I https://clublre.com.ar/apple-icon    # 180×180

# JSON-LD en SERP
# Pegar URL en https://search.google.com/test/rich-results
```

### 13.4 Bundle analysis — ✅ aplicado

`npm run analyze` corre `next build && next experimental-analyze -o`
y deja reporte en `.next/diagnostics/analyze/index.html`. Útil
cuando se agrega una dep o se sospecha regresión de tamaño.

### 13.5 Pre-deploy checklist

Antes de cada release taggeado:

1. `npm run type-check && npm run lint && npm run build` — limpio.
2. `npm run analyze` — diff de bundle, sin regresiones.
3. Probar localmente con `npm run dev` — DevTools → Network tab
   verificá:
   - `<link rel="icon" href="/icon">` cargado
   - `<link rel="apple-touch-icon" href="/apple-icon">` cargado
   - `<meta property="og:image" content=".../opengraph-image">` presente
   - JSON-LD `<script type="application/ld+json">` con `@type: SportsClub`
4. Linter de opengraph.xyz → score 7/7 verde en description y title.
5. Lighthouse → Performance ≥ 95, Accessibility = 100, Best Practices = 100.

---

## 14. Cross-discipline design reviews

Las instrucciones en `.github/instructions/interface-better-*.instructions.md`
incluyen un orquestador (`better-interface`) que revisa la UI a través de
los seis dominios: accesibilidad, layout, writing, typography, colors y ui.
Se aplica en modo `full` (15 findings cap) o `quick` (5 findings cap) y
produce un reporte consolidado con severidad compartida (HIGH / MEDIUM /
LOW), ubicación `path:line`, y una tabla de "considered but rejected" para
hacer visible la restraint.

### Workflow

1. Cargar las 6 instrucciones de better-* (orquestador + 5 owners).
2. Recon del stack (Next / HeroUI / Tailwind / tokens / viewports).
3. Revisar en este orden — los fallos fundacionales no deben quedar
   tapados por polish:
   1. better-accessibility
   2. better-layout
   3. better-writing
   4. better-typography
   5. better-colors
   6. better-ui
4. Consolidar findings — una causa raíz = un finding, sin duplicar.
5. Verificar lo verificable (tsc, lint, build, browser preview).
6. Cerrar con un verdict: `Block` / `Needs changes` / `Approve`.

### Principios no negociables

- **Read-only por default.** Un review no edita código salvo que el
  usuario también pida implementar los hallazgos.
- **Citar `path:line`** en cada finding. Sin ubicación exacta, no es
  finding — es opinión.
- **Encontrar el system, no el síntoma.** Una causa raíz (token mal
  definido, prop dead) gana sobre la misma falla repetida 5 veces.
- **Mostrar restraint.** La tabla "considered but rejected" deja
  explícitas las decisiones que NO se tomaron y por qué.

### Tokens descubiertos durante reviews

| Token                       | Hallazgo                                                                                            | Acción                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `--color-amarillo-soft`     | `bg-[#3A6BE0]` en `BlurryBlob` y `text-[#1B4FCF]` en `Eyebrow` violaban la regla "no arbitrary hex" | Agregado a `@theme` + `@theme inline` + alias TS en `config/design-tokens.ts`            |
| `<SectionHeader>` primitive | 4 páginas duplicaban el bloque `eyebrow + h2 + descripción` con variantes de `mb-10`/`mb-12`        | Extraído a `components/ui/SectionHeader.tsx` con variants de `align`, `width`, `spacing` |

### Hallazgos históricos

- **2026-07-30 — full review (better-interface).** Reporte inicial:
  `Needs changes` (1 HIGH + 7 MEDIUM + 2 LOW). HIGH #1 cerrado:
  `role="alert"` + `aria-live="assertive"` en `app/error.tsx` y
  `app/blog/error.tsx`. 7 de 7 MEDIUM y 2 de 2 LOW atendidos en commits
  `0f270c2`, `5b97d67`, `9cd37d8`, `c1b3314`, `7bacc71`. Verdict final:
  `Approve`.

---

## 15. Skeleton loaders con `<phantom-ui>`

`@aejkatappaja/phantom-ui` es un **Web Component Lit universal**
(~8 kB minzipped, MIT) que envuelve cualquier subtree y genera
shimmer placeholders midiendo el DOM real con `getBoundingClientRect`.
Funciona en React, Vue, Svelte, Angular, Solid, Qwik o vanilla JS,
pero acá lo consumimos desde React vía JSX typings.

El sitio lo usa como reemplazo de los `<div className="animate-pulse">`
hand-rolled — el shimmer se ajusta automáticamente a las dimensiones
reales del contenido (no a aproximaciones nuestras), lo que evita
layout shift cuando llega la data.

### Setup (hecho una vez)

1. **Dependencia** en `package.json`:
   `"@aejkatappaja/phantom-ui": "^1.4.0"`.
2. **`phantom-ui.d.ts`** en la raíz del proyecto — type-augment de
   `react/jsx-runtime.JSX.IntrinsicElements` para que TypeScript
   reconozca `<phantom-ui>` en JSX.
3. **`import '@aejkatappaja/phantom-ui/ssr.css'`** en `app/layout.tsx`
   — pre-hydration CSS que oculta el contenido placeholder hasta
   que el Web Component se active.
4. Los `loading.tsx` deben ser `'use client'` porque el componente
   usa APIs de browser.

### Uso básico

```tsx
'use client';
<phantom-ui animation="shimmer" duration={1.5} loading loading-label="Cargando">
  {/* contenido real con placeholders invisibles */}
  <h1>Título</h1>
  <p>Párrafo de ejemplo…</p>
</phantom-ui>;
```

Atributos clave:

| Atributo        | Default    | Uso                                       |
| --------------- | ---------- | ----------------------------------------- |
| `loading`       | `false`    | Mostrar shimmer o no                      |
| `animation`     | `shimmer`  | `shimmer`, `pulse`, `breathe`, `solid`    |
| `duration`      | `1.5`      | Segundos por ciclo                        |
| `stagger`       | `0`        | Delay entre bloques (en s)                |
| `reveal`        | `0`        | Fade-out cuando termina la carga          |
| `count`         | `1`        | Repetir un template N veces (listas)      |
| `mode`          | `skeleton` | `skeleton` (oculta) o `overlay` (refresh) |
| `loading-label` | `Loading`  | `aria-label` accesible                    |

### Cuándo usarlo

✅ **Loading UI de segments** (`loading.tsx`) que reflejan un layout real.
✅ **Listas con data fetching** futuro (eventos, fixtures, resultados) —
`count={n}` repite el template mientras carga.
✅ **Refresh states** con `mode="overlay"` — no oculta el contenido previo,
le pasa una luz por encima.

❌ **NO** para spinners de botón (usa un `<Spinner>` de HeroUI).
❌ **NO** para loading de páginas 100% server-rendered sin data
fetching (no necesitás shimmer).
❌ **NO** metas el navbar o footer dentro de `<phantom-ui loading>` —
esos ya están en cache post-redirect.

### Trade-offs honestos

- **+** Perceived performance: el layout no salta cuando llega la data.
- **+** DX: un solo componente, sin sincronizar skeleton ↔ UI real.
- **+** Accesible: `aria-busy`, `loading-label`, `prefers-reduced-motion`
  honrado automáticamente.
- **-** ~11 kB de runtime (phantom-ui + Lit) al cliente.
- **-** `'use client'` boundary en cada `loading.tsx`.
- **-** Si el contenido es 100% SSR estático, el shimmer no aporta
  valor (la página ya está en HTML).

### Convenciones del proyecto

- **Naming del slot**: el texto dentro de `<phantom-ui loading>`
  sigue siendo copy real (título, párrafo); el `ssr.css` lo oculta.
  No escribir "Cargando…" dos veces.
- **Loading embebido en componentes**: usar `<phantom-ui loading>`
  directo. NO crear wrappers tipo `<CardLoading>` — el componente real
  ya es el template del skeleton.
- **Color del shimmer**: dejar el default `rgba(128,128,128,0.3)`.
  Si hace falta contrastar más, exponer `shimmer-color` desde el
  design token (`--foreground` con alpha) en `globals.css`.

---

## Cómo reabrir esta lista

Cuando se priorice un item:

1. Moverlo a una nueva sección arriba (no queda en "Pendientes").
2. Abrir un GitHub Issue referenciando el número de sección (§X.Y).
3. Crear branch `feat/<short-name>` desde `main`.
