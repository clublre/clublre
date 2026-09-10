# Club Los Rosarinos Estudiantil — Sitio web

Sitio oficial del **Club Los Rosarinos Estudiantil** (CLUB L.R.E), una
institución deportiva y social de Rosario, Argentina, fundada en 1943.

## Stack

- **[Next.js 16](https://nextjs.org/)** — App Router, Turbopack, Server Components
- **[React 19](https://react.dev/)** — Server Actions, `useOptimistic`, `<Form>`
- **[HeroUI v3](https://heroui.com/)** — `nextui.org` rebranded, sobre React Aria + Tailwind v4
- **[Tailwind CSS v4](https://tailwindcss.com/)** — CSS-based config (`@theme`)
- **[TypeScript 6](https://www.typescriptlang.org/)** — strict
- **[next-themes](https://github.com/pacocoursey/next-themes)** — light/dark
- **[pnpm 10](https://pnpm.io/)** — package manager (con Corepack + `engines.runtime`)
- **[Vercel](https://vercel.com)** — hosting (Hobby plan, región iad1)

## Requisitos

- **Node.js 22+** (recomendado 24.x, ver `.nvmrc`).
- **pnpm** — instalable via `corepack enable` (viene con Node 16+).

## Setup local

```bash
# 1. Clonar e instalar
git clone git@github.com:clublre/clublre.git
cd clublre
nvm use          # usa Node del .nvmrc
corepack enable  # habilita pnpm via Corepack
pnpm install     # auto-configura git hooks (husky)

# 2. Variables de entorno (opcional por ahora)
cp .env.example .env.local
# editar .env.local con tus keys de Supabase / Resend cuando las tengas

# 3. Dev server
pnpm dev         # http://localhost:3000
```

## Scripts

- `pnpm dev` — dev server (Turbopack).
- `pnpm build` — build de producción.
- `pnpm start` — arranca el build.
- `pnpm lint` — ESLint 9 (flat config).
- `pnpm lint:fix` — ESLint con `--fix`.
- `pnpm type-check` — TypeScript sin emitir.

## Deploy

Push a `main` o `develop` dispara deploy automático en Vercel.
Ver [`docs/RUNBOOK.md`](docs/RUNBOOK.md) para el setup completo de las
cuentas externas (Vercel, GitHub Org, NIC Argentina para el dominio,
Supabase, Resend, Cloudflare Turnstile).

Auth (registro/login Supabase, tabla `members`, maqueta en paralelo):
[`docs/AUTH.md`](docs/AUTH.md).

## Pre-commit hooks

Cada commit corre automáticamente:

| Hook           | Qué hace                                                                  | Bypass        |
| -------------- | ------------------------------------------------------------------------- | ------------- |
| **pre-commit** | `pnpm exec lint-staged` → ESLint `--fix` + Prettier sobre archivos staged | `--no-verify` |
| **commit-msg** | Valida Conventional Commits (`type(scope): subject`)                      | `--no-verify` |

Ver [AGENTS.md](AGENTS.md) §"Pre-commit hooks" para el detalle.

## Sistema de diseño

Tokens definidos en dos lugares (sincronizados):

1. `styles/globals.css` — bloque `@theme` (Tailwind v4).
2. `config/design-tokens.ts` — constantes TS.

Domain content (activities, commission, pricing tiers, blog posts)
vive en `data/` y se reemplaza por un CMS en producción.

### Paleta

- **Primary** — HeroUI **Sky** theme (cyan/blue). Override de `--accent`
  en `styles/globals.css`. Usá `bg-primary` / `text-primary` o los utilities
  built-in de Tailwind `bg-sky-*` / `text-sky-*`.
- **Secondary** (cobalto) — Tailwind built-in `bg-blue-700` /
  `text-blue-700`. **No usar `bg-amarillo`** ni nombres custom: pueden
  romper por auto-referencia en `@theme inline`.

### Atomic design

| Capa      | Carpeta                 | Regla                                               |
| --------- | ----------------------- | --------------------------------------------------- |
| atoms     | `components/atoms/`     | Single-purpose, sin state. Wrappers de HeroUI.      |
| molecules | `components/molecules/` | atoms + state/logic (ej. ThemeToggle).              |
| organisms | `components/organisms/` | Full sections (Navbar, Footer).                     |
| ui        | `components/ui/`        | Layout & decorative primitives (Section, CardClub). |

## Estructura del proyecto

```
app/                  # Next.js App Router (rutas, layouts, error boundaries)
components/
  atoms/              # Atoms — wrappers de HeroUI
  molecules/          # Molecules — atoms + state
  organisms/          # Organisms — secciones completas
  ui/                 # UI primitives — Section, CardClub, etc.
  pages/              # Composición por ruta (home/, admin/, marketplace/)
  layouts/            # Layouts especiales (AdminNavBar)
config/               # Tokens, site config, fonts
data/                 # Domain data (activities, members, listings, posts)
lib/                  # Helpers (utils, breadcrumbs, auth-helpers, csv)
stores/               # Zustand stores (auth, marketplace, ui)
styles/               # globals.css con @theme block
docs/                 # RUNBOOK.md (setup operativo)
.github/              # AGENTS.md, .instructions/, workflows/ci.yml,
                      # PULL_REQUEST_TEMPLATE.md, dependabot.yml, CODEOWNERS
public/               # assets estáticos + llms.txt
supabase/             # skeleton para migrations (vacío hasta migración)
emails/               # skeleton para React Email templates (vacío)
```

## Convenciones

- **ES** para todo el copy (`lang="es"`).
- **Tailwind utilities** — nunca inline styles; nunca valores arbitrarios
  (`bg-[#xxx]`).
- **Atomic design** — nuevos componentes compartidos van en `atoms/`,
  `molecules/`, `ui/` u `organisms/`. Nunca en la raíz de `components/`.
- **Tokens duplicados** — cualquier color/space nuevo va en **ambos** `globals.css` y `design-tokens.ts`.
- **Conventional Commits** — mensajes con formato `type(scope): subject`.

## Documentación adicional

- [`AGENTS.md`](AGENTS.md) — reglas para AI agents (governance + pre-commit hooks).
- [`BEST-PRACTICES.md`](BEST-PRACTICES.md) — biblia arquitectónica (decisiones + razones).
- [`STACK.md`](STACK.md) — propuesta de stack técnico (Supabase + Resend + Vercel).
- [`MAQUETA.md`](MAQUETA.md) — qué está simulado vs. producción.
- [`docs/RUNBOOK.md`](docs/RUNBOOK.md) — paso a paso para levantar la infra.

## License

MIT (ver [LICENSE](LICENSE)).
