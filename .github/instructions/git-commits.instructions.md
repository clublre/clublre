---
applyTo: '**/*'
---

# Git & commit conventions

These are loaded automatically for any change in this repo.

## Conventional Commits

Format: `<type>(<scope>): <subject>`

Types:

- `feat:` — new user-facing functionality.
- `fix:` — bug fix.
- `refactor:` — internal change, no new functionality.
- `chore:` — tooling, deps, config. No behaviour change.
- `docs:` — only documentation.
- `style:` — formatting only (whitespace, semicolons). No logic change.
- `test:` — adding or fixing tests.
- `perf:` — performance improvement.

Subject: imperative, lowercase, no period, ≤72 chars.

Examples:

- `feat(pricing): add destacado ring to plan familiar`
- `fix(navbar): aria-label en botón de cierre de menú mobile`
- `chore(deps): bump framer-motion to 12.x`
- `docs(best-practices): documentar dark mode tokens`

## Branches

- `main` — production, always deployable.
- `feat/<short-name>` — new features.
- `fix/<short-name>` — bug fixes.
- `chore/<short-name>` — tooling.

## Pre-commit checklist

Before committing, run:

```bash
npm run type-check
npm run lint
```

> Solo correr si el usuario lo pide o en handoff. No es parte del
> flujo por default — ver `AGENTS.md` §"Validation cadence".

If UI changed, also smoke-test in browser:

```bash
npm run dev  # then visit localhost:3000
```

## Authorization for commit / push

- **No commitear ni pushear sin orden explícita del usuario.**
  Frases como "dale", "ok", "listo", "perfect" son **acknowledgments**,
  no autorizaciones. Pedir confirmación antes de `git commit` /
  `git push` si el usuario no lo pidió explícito.
- Autorizaciones válidas (no exhaustivo): "commitea", "hacé commit",
  "commit", "pusheá", "subilo", "mandá los commits", "yes please commit".

## Don't commit

- `.env*` files.
- `node_modules/`.
- `.next/` build output.
- Generated files from MCP agents (unless intentional).
- Secrets of any kind.
- `package-lock.json` from previous NextUI v2 install (we removed it
  intentionally — use `npm install` to regenerate).

## PR descriptions

Use this template:

```md
## What

<one-paragraph summary>

## Why

<motivation, link to issue if any>

## How

<implementation notes, anything reviewers should know>

## Screenshots / recordings

<if UI change>

## Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] UI tested in browser (if applicable)
```
