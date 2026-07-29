# GitHub Copilot — additional instructions

> Loaded automatically by VS Code / GitHub Copilot. Sits alongside
> `AGENTS.md` (the repo-wide governance doc). When this file is more
> specific than `AGENTS.md`, this one wins.

---

## Working style

- **Prefer small, reviewable PRs.** If a task spans many files, split
  it.
- **Always read the file you're about to edit.** Don't propose changes
  based on memory.
- **Don't auto-apply.** When suggesting code in chat, prefix with
  "Suggested:" if it's a non-trivial change.
- **TypeScript first.** Always show types in suggestions.

---

## Component selection cheat-sheet

| User asks for… | Use |
|---|---|
| A button | `<Button>` from `@heroui/react`. |
| A link to internal page | `<NextLink href="...">` with `Route` type. |
| A link to external URL | Plain `<a>` with `target="_blank" rel="noopener noreferrer"`. |
| A card / panel | `<CardClub>` from `@/components/patterns`. |
| A page section with padding | `<Section variant="..." spacing="...">`. |
| A constrained-width wrapper | `<Container size="...">`. |
| An icon button | `<button aria-label="...">` with react-icons child. |
| A switch / toggle | `<Switch>` from `@heroui/react`. |
| A nav bar | The existing `components/navbar.tsx` pattern (sticky `<nav>`). |
| A form input | `<Input>` from `@heroui/react`. |

If none of these fit, say so and propose a new pattern — don't invent
ad-hoc markup.

---

## Token usage

When generating a class string that includes a brand color:

```tsx
// ✅
className="bg-estu-azul-500 text-white hover:bg-estu-azul-600"

// ❌
className="bg-[#0009A0]"
```

When you need a value that isn't in the palette, **add it to
`styles/globals.css` and `config/design-tokens.ts`** first, then use
the utility.

---

## When you're generating forms

- Use HeroUI `<Input>` / `<TextArea>` / `<Select>`.
- Labels are required — HeroUI provides them via `label` prop or wrap
  with `<Label>` + `<Input>`.
- Validation messages use `<FieldError>`.
- For multi-field forms, wrap in `<Form>` (React 19).

```tsx
import { Input, Label, FieldError } from "@heroui/react";

<form>
  <Label htmlFor="email">Email</Label>
  <Input id="email" name="email" type="email" required />
</form>
```

---

## Common mistakes to avoid

1. ❌ Adding `"use client"` to a file that doesn't need it.
2. ❌ Importing from `@nextui-org/*` (v2, removed).
3. ❌ Wrapping the app in `<NextUIProvider>`.
4. ❌ Using `bg-gradient-to-r from-[#xxx]` instead of tokenized
   gradients.
5. ❌ Hardcoding font families in CSS instead of using `next/font`.
6. ❌ Importing from `next-themes/dist/types` (use `next-themes` directly).
7. ❌ Using `Button` `as={Link}` (not supported in HeroUI v3). Wrap a
   `<NextLink>` around the `<Button>` instead.
8. ❌ Using `isExternal` on `<Link>` (removed in HeroUI v3). Use
   `target="_blank" rel="noopener noreferrer"` directly.

---

## Refusals

If the user asks you to do something that violates this file or
`AGENTS.md`, push back politely with a one-line explanation and a
suggested alternative. Examples:

- "NextUIProvider isn't needed in HeroUI v3 — I'll just use
  next-themes directly."
- "I'll add the brand color to the design tokens instead of using an
  arbitrary value."

Don't be preachy. One line + alternative is enough.