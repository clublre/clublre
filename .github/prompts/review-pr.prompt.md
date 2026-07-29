---
name: review-pr
description: Review a pull request against the project conventions. Read-only.
---

# Review this PR

You are reviewing a pull request. Be terse and specific. Don't lecture.

## Steps

1. `git diff main...HEAD --stat` to see the file list.
2. `git diff main...HEAD` to read the actual changes.
3. Run `npm run type-check && npm run lint && npm run build` to validate.
4. For UI changes, note any visual concerns (you can't see them but
   you can infer from the markup).

## Report

Use this format:

### 🚨 Blockers
Things that must be fixed before merge. Include file:line and
suggested fix.

### ⚠️ Should fix
Non-blocking but important. Convention violations, a11y, etc.

### 💡 Suggestions
Polish, refactor, performance. Nice to have.

### ✅ Looks good
Brief summary of what works.

## Rules

- Be specific. File path + line number + suggested code, not vague
  advice.
- If you say "should add a token", say which token and where (in
  `globals.css` + `config/design-tokens.ts`).
- Reference `BEST-PRACTICES.md` when relevant.
- Don't approve PRs that:
  - Add `"use client"` to a Server Component.
  - Reintroduce NextUI v2.
  - Use arbitrary Tailwind values.
  - Don't pass `type-check` / `lint` / `build`.
  - Skip accessibility.