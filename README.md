# Club Los Rosarinos Estudiantil — Sitio web

Sitio oficial del **Club Los Rosarinos Estudiantil** (CLUB L.R.E), una institución deportiva y social de Rosario, Argentina, fundada en 1943.

## Stack

- **[Next.js 16](https://nextjs.org/)** — App Router, Turbopack
- **[React 19](https://react.dev/)**
- **[HeroUI v3](https://heroui.com/)** — `nextui.org` rebranded, sobre React Aria + Tailwind v4
- **[Tailwind CSS v4](https://tailwindcss.com/)** — CSS-based config (`@theme`)
- **[TypeScript 6](https://www.typescriptlang.org/)**
- **[next-themes](https://github.com/pacocoursey/next-themes)** — light/dark
- **[Tailwind Variants](https://tailwind-variants.org)** — type-safe variants
- **[React Icons](https://react-icons.github.io/react-icons)** — íconos

## Requisitos

- **Node.js 22.21.1** (ver `.nvmrc`).

## Setup

```bash
nvm use            # usa la versión del .nvmrc
npm install
npm run dev        # http://localhost:3000
```

## Scripts

- `npm run dev` — dev server (Turbopack).
- `npm run build` — build de producción.
- `npm run start` — arranca el build.
- `npm run lint` — ESLint 9 (flat config).
- `npm run lint:fix` — ESLint con `--fix`.
- `npm run type-check` — TypeScript sin emitir.

## Sistema de diseño

Tokens definidos en dos lugares (sincronizados):

1. `styles/globals.css` — bloque `@theme` (Tailwind v4).
2. `config/design-tokens.ts` — constantes TS.

### Paleta de marca

- **Azul** `#0009A0` — `bg-estu-azul`, `text-estu-azul-*`
- **Amarillo** `#EEE457` — `bg-estu-amarillo`, `text-estu-amarillo-*`

### Patterns reutilizables (`components/patterns/`)

| Componente     | Uso                                                                |
| -------------- | ------------------------------------------------------------------ |
| `<Section>`    | Wrapper semántico de página (`variant` y `spacing` configurables). |
| `<Container>`  | Wrapper con max-width + padding consistente.                       |
| `<Eyebrow>`    | Label pequeño uppercase sobre un heading.                          |
| `<CardClub>`   | Card de marca con accent stripe opcional.                          |
| `<BlurryBlob>` | Blobs animados decorativos para hero.                              |

## Estructura

```
app/                  # Next.js App Router
  layout.tsx
  page.tsx            # Home (hero, actividades, CTA)
  about/              # Historia, valores, comisión
  blog/               # Blog index
  pricing/            # Cuotas
  providers.tsx
components/
  navbar.tsx
  footer.tsx
  theme-switch.tsx
  patterns/           # Design system primitives
config/
  site.ts
  design-tokens.ts
  fonts.ts
styles/
  globals.css         # @import tailwindcss + @heroui/styles + @theme
public/
  llms.txt            # Contexto para AI agents
```

## Convenciones

- **ES** para todo el copy (`lang="es"`).
- **Tailwind utilities** — nunca inline styles.
- **Patterns primero** — usar `<Section>`, `<Container>`, `<CardClub>` en vez de clases sueltas.
- **Tokens duplicados** — cualquier color/space nuevo va en **ambos** `globals.css` y `design-tokens.ts`.

## AI tooling

- **HeroUI MCP server** configurado en `.vscode/mcp.json` (`heroui-react`).
- **`llms.txt`** en `public/` para crawlers de LLMs.
- **Globales** en `~/Library/Application Support/Code/User/mcp.json` (Figma, context7, GitHub, etc.).

## License

MIT (ver [LICENSE](LICENSE)).
