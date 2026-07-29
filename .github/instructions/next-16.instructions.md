---
applyTo: 'app/**/*.{ts,tsx}'
---

# Next.js 16 — file-based metadata + view transitions + React 19

Next 16 + React 19 unlock several conventions. Apply them when
working in `app/`.

## File-based metadata routes (auto-routes in `app/`)

| File                      | Auto-routed URL    | Purpose                            |
| ------------------------- | ------------------ | ---------------------------------- |
| `opengraph-image.tsx`     | `/opengraph-image` | OG image (1200×630 PNG) for shares |
| `icon.tsx`                | `/icon`            | Favicon (32×32 PNG)                |
| `apple-icon.tsx`          | `/apple-icon`      | Apple touch icon (180×180 PNG)     |
| `robots.ts`               | `/robots.txt`      | `MetadataRoute.Robots` export      |
| `sitemap.ts`              | `/sitemap.xml`     | `MetadataRoute.Sitemap` export     |
| `opengraph-image.alt.txt` | (no URL)           | Alt text for OG image              |

For metadata image routes:

- Default runtime is Edge. If you read `public/*.jpeg` /
  `*.png` with `node:fs/promises`, **pin to Node explicitly**:

  ```ts
  export const runtime = 'nodejs';
  ```

- Use `next/og`'s `ImageResponse` (uses Satori under the hood).
- Read assets once at build time:

  ```ts
  const data = await readFile(join(process.cwd(), 'public/logo.jpeg'));
  const src = `data:image/jpeg;base64,${data.toString('base64')}`;
  ```

## JSON-LD in root layout

Inject a schema.org payload as `<script type="application/ld+json">`
**before** your client providers (so it ships in the SSR HTML):

```tsx
<script
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  type="application/ld+json"
/>
<Providers>...</Providers>
```

Safe because the payload is built from typed code (no untrusted
input). For a SportsClub, the schema needs `name`, `address`,
`telephone`, `sameAs` minimum; Google rich-results test will
tell you what's still missing.

## View Transitions (experimental)

`next.config.js` has `experimental.viewTransition: true`. Add
`view-transition-name` to elements you want to cross-fade between
routes:

```tsx
// app/page.tsx (origin)
<h1 style={{ viewTransitionName: 'page-title' }}>...</h1>

// app/destino/page.tsx (destination, same name → matched)
<h1 style={{ viewTransitionName: 'page-title' }}>...</h1>
```

Naming convention used today: `page-title` for every route H1.
Next step: name the logo, CTAs and activity cards for cross-fades
between home ↔ /about, home ↔ /pricing, blog index ↔ blog detail.

Safari < 18 falls back to an instant cut. No regression.

## Route-segment boundaries

For any dynamic route that can fail or async-load, ship:

- `app/<route>/loading.tsx` — skeleton matching the final typographic
  rhythm. Use `aria-hidden` so screen readers don't announce it.
- `app/<route>/error.tsx` — fallback that DOES NOT crash the layout.
  Capture with `Sentry.captureException(error, { tags: { boundary:
'<route>' } })`.

Multiple boundaries form layers: route-level + global (`app/error.tsx`).

## React 19 + React Compiler

`next.config.js` has `reactCompiler: { target: '19' }` enabled.
Stable as of React 19; safe with HeroUI + React Aria Components.

Consequence: most manual `useMemo` / `useCallback` is unnecessary.
Drop them when you can verify the compiler covers the case. The
few that remain are signal for "I depend on referential identity
of this for downstream memoization" — keep them, but only with
a comment explaining why.

Don't disable `reactStrictMode` to silence dev warnings — it
catches real bugs.

## Security headers

CSP / HSTS / X-Frame-Options / Permissions-Policy live in
`next.config.js > async headers()`. Headers are intentionally NOT
applied in dev (Vercel Live + HMR + liveness probes need loose
CSP). Production builds pick them up automatically.
