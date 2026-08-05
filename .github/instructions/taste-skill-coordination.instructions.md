---
applyTo: '**/*.{ts,tsx,css}'
description: 'Reconciliation rules between taste-skill (anti-slop) and AGENTS.md governance'
---

# taste-skill ↔ AGENTS.md coordination

Reconcile `taste-skill` v2 con la gobernanza del proyecto para que los dos
sets de reglas no peleen entre sí. Se carga automáticamente con cualquier
trabajo de UI.

## 1. Active subskills (only these load)

taste-skill instala 13 subskills bajo `.agents/skills/`. **Solo seguí estos**:

- `design-taste-frontend` (v2) — guía anti-slop principal.
- `redesign-existing-projects` — encaja con nuestro trabajo iterativo.
- `full-output-enforcement` — evita placeholders / trabajo a medias.

**Ignorar** (presentes en disco pero no aplicar): `design-taste-frontend-v1`,
`minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `image-to-code`,
`imagegen-frontend-web`, `imagegen-frontend-mobile`, `stitch-design-taste`,
`brandkit`, `high-end-visual-design`.

## 2. Precedence matrix

Cuando taste-skill y AGENTS.md / `interface-better-*` choquen, ganar el de
esta tabla. En caso de duda, AGENTS.md gana — encode decisiones de marca.

| Tema                            | Ganador              | Motivo                                                                                                                        |
| ------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Familia tipográfica             | **AGENTS.md**        | Inter vía `next/font` es intencional. **No** cambiar a Geist/Outfit.                                                          |
| Colores de acento               | **AGENTS.md**        | `bg-sky-500` (primary) + `bg-blue-700` (cobalto) son tokens de marca. La regla "one accent" de taste-skill **no** aplica acá. |
| Componente de card              | **AGENTS.md**        | `<CardClub>` es la card de marca. La regla "no tres columnas iguales" **sí** aplica.                                          |
| Estructura de carpetas          | **AGENTS.md**        | Atomic design (atoms/molecules/organisms/pages/ui).                                                                           |
| Variabilidad de `border-radius` | **taste-skill**      | Más cerrado en inner, más abierto en containers.                                                                              |
| Anti-gradientes AI-purple       | **taste-skill**      | Ya cumplimos (no hay tokens púrpura).                                                                                         |
| Anti "tres cards iguales"       | **taste-skill**      | Aplicar al diseñar filas de cards nuevas.                                                                                     |
| Alineación óptica               | **taste-skill**      | Ajustes de 1–2px en íconos-en-círculo, texto de botón.                                                                        |
| Paridad dark mode               | **Ambos de acuerdo** | `next-themes` + tokens oklch.                                                                                                 |
| Design system oficial           | **Ambos de acuerdo** | HeroUI v3 es el sistema oficial — no inventar componentes custom.                                                             |
| Audit-first en cambios          | **Ambos de acuerdo** | Por regla high-risk de `git-commits.instructions.md`.                                                                         |

## 3. v2 es experimental — fallback

taste-skill v2 está marcada "experimental" por los maintainers.

- **No pinear** taste-skill a un commit específico — dejar que `npx skills add`
  tire la última.
- Si v2 empieza a generar más slop en vez de menos, **caer a v1** con
  `--skill design-taste-frontend-v1`.
- **No citar** wording literal de taste-skill en commits o docs — puede cambiar.
- Los **Three Dials** (`VARIANCE / MOTION / DENSITY`) son puntos de partida,
  no mandamientos.

## 4. Cuándo cargar taste-skill

- **Engage** cuando: diseñás componentes nuevos, rediseñás UI existente,
  elegís colores/tipografía/espaciado para secciones nuevas.
- **Skip** cuando: escribís código non-UI (stores, types, utils, tests,
  lógica de server). Ahí usá solo AGENTS.md + tipos.
- **Siempre correr el pre-flight** (§14 de taste-skill) antes de despachar
  cambios de UI: contraste, focus rings, estados empty/loading/error,
  fallback `prefers-reduced-motion`.

## 5. Custom additions (reglas propias del proyecto)

Estas **extienden** taste-skill donde el proyecto tiene necesidades
específicas — no las contradice:

- **Comentarios / JSDoc / headers**: español (regla "Comments" de AGENTS.md).
  taste-skill no opina sobre copy.
- **Copy en español**: tono y voz de `interface-better-writing.instructions.md`.
- **Componentes HeroUI v3**: siempre desde `@heroui/react`. La regla "real
  design system" de taste-skill refuerza esto — no reinventamos primitivos.
- **Sin deps nuevas** sin chequear compat con React 19 / Next 16 / HeroUI v3.
- **Sin nombres de color custom** (`bg-amarillo` / `bg-cobalt`) — usar la
  paleta de Tailwind (`bg-sky-500`, `bg-blue-700`).
