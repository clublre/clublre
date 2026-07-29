---
applyTo: "**/*.tsx"
---

# HeroUI v3 rules

These are loaded automatically when Copilot touches any TSX file.

## No Provider

```tsx
// ❌ WRONG — NextUI v2 pattern, removed in v3
<NextUIProvider navigate={router.push}>
  <NextThemesProvider>...</NextThemesProvider>
</NextUIProvider>

// ✅ Correct
<NextThemesProvider attribute="class" defaultTheme="dark">
  ...
</NextThemesProvider>
```

HeroUI v3 reads theme from `next-themes` automatically via the
`data-theme` / `class` attribute on `<html>`.

## Use the HeroUI MCP for component questions

`.vscode/mcp.json` has the `heroui-react` MCP configured. Use it when:

- You're unsure which props a component accepts.
- You need an example of the compound API.
- You want to know the available variants.

Available tools:

- `mcp__heroui_react_list_components`
- `mcp__heroui_react_get_component_docs`
- `mcp__heroui_react_get_component_source_code`
- `mcp__heroui_react_get_component_source_styles`
- `mcp__heroui_react_get_theme_variables`
- `mcp__heroui_react_get_docs`

## Common component gotchas

### Button

```tsx
// ✅ variant prop, not color prop
<Button variant="primary">OK</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>

// ❌ Button as={Link} — removed in v3
<Button as={NextLink} href="/x">...</Button>

// ✅ wrap with NextLink
<NextLink href="/x">
  <Button>X</Button>
</NextLink>
```

Variants: `primary | secondary | tertiary | outline | ghost | danger |
danger-soft`. No `radius` prop — use `className="rounded-full"` etc.

### Link

```tsx
// ✅ use target/rel for external
<Link href="https://..." target="_blank" rel="noopener noreferrer">
  ...
</Link>

// ❌ isExternal was removed
<Link isExternal href="https://...">...</Link>
```

### Switch

Compound API:

```tsx
<Switch isSelected={value} onChange={setValue}>
  <Switch.Control>
    <Switch.Thumb>
      <Switch.Icon>☀️</Switch.Icon>
    </Switch.Thumb>
  </Switch.Control>
</Switch>
```

Note: `onChange`, not `onValueChange`.

### Navbar / Footer / Hero

**There is no `Navbar` component in HeroUI v3.** Use semantic HTML +
utility classes (see `components/navbar.tsx` and `components/footer.tsx`
for the pattern).

Same for `Hero`, `HeroSection`, etc. — these are patterns we build from
`<Section>` + `<Container>` + utility classes.

## When to use HeroUI vs. patterns

| Use HeroUI when…                                         | Use patterns (`components/patterns/`) when…           |
| -------------------------------------------------------- | ----------------------------------------------------- |
| You need interactive behavior (modal, popover, dropdown) | You need layout containers (section, container, card) |
| You need a form control with validation                  | You need a brand-styled card or eyebrow label         |
| You need a known UI primitive (button, link, switch)     | You need a decorative element (BlurryBlob)            |

If you need both, compose: pattern as wrapper + HeroUI inside.
