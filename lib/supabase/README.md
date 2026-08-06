# Supabase clients

Tres clientes para los tres contextos donde se usa Supabase.

## Estructura esperada

```
lib/supabase/
├── README.md
├── server.ts              # createClient() — para RSC + Server Actions
├── client.ts              # createBrowserClient() — para Client Components (raro)
├── admin.ts               # service-role client — SOLO server, bypasea RLS
└── types.ts               # tipos generados desde el schema (`supabase gen types`)
```

## server.ts — el más usado

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde Server Component — no se pueden set cookies.
            // Ignorar si hay middleware refreshing la sesión.
          }
        },
      },
    },
  );
}
```

**Uso**: en cada Server Component que necesita data del usuario actual, o en cada Server Action que muta.

## client.ts — raro

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
  );
}
```

**Uso**: solo para Realtime listeners o UI state que vive en el cliente. **Casi nunca se usa** — la mayoría del data fetching va por RSC.

## admin.ts — peligroso

```ts
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['SUPABASE_SERVICE_ROLE_KEY']!, // ⚠️ bypasea RLS
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
```

**Uso**: SOLO en Route Handlers de webhooks (verificación de firma) o jobs programados. **NUNCA** en Server Components de lectura normal ni en Server Actions de usuario.

**Por qué es peligroso**: bypasea TODAS las RLS policies. Un bug en una action que usa admin = acceso no autorizado a toda la DB.

## types.ts — autogen

```bash
# Regenerar después de cada migration
supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
```

Tipos generados del schema → autocomplete en `supabase.from('listings').select()`. Commitear al repo.

## Estado

⏸ Vacío — se pobla en Semana 1-2 del roadmap (STACK.md §8).
