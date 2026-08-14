# Server Actions

Carpeta para las [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions) de Next.js 16. Cada archivo agrupa acciones de un dominio.

## Estructura esperada

```
app/actions/
├── README.md
├── auth.ts             # signIn, signOut, signInWithGoogle, etc.
├── members.ts          # applyForMembership, approveMember, rejectMember, suspendMember
├── listings.ts         # createListing, updateListing, archiveListing, reportListing
├── moderation.ts       # resolveReport, hideListing (admin/mod)
└── profile.ts          # updateAvatar, updateProfile
```

## Patrón

```ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';

const InputSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  // ...
});

export async function createListing(formData: FormData) {
  // 1. Auth — server-side, nunca confiar en el cliente
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'No autenticado' };

  // 2. Validar con Zod (no confiar en HTML required, no confiar en client validation)
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: 'Datos inválidos', issues: parsed.error.flatten() };
  }

  // 3. Mutación (RLS en Supabase valida que owner_id = auth.uid())
  const { data, error } = await supabase
    .from('listings')
    .insert({ ...parsed.data, owner_id: user.id, status: 'pending_review' })
    .select()
    .single();

  if (error) return { error: error.message };

  // 4. Side effects (email, audit log, etc.)
  await supabase.from('audit_log').insert({
    actor_id: user.id,
    action: 'create_listing',
    entity_type: 'listing',
    entity_id: data.id,
    payload: { title: data.title },
  });

  // 5. Revalidar cache de Next
  revalidatePath('/marketplace');
  return { data };
}
```

## Reglas

- `'use server'` en la primera línea del archivo.
- Validar con Zod en cada action (nunca confiar en el cliente).
- Auth check al inicio (`supabase.auth.getUser()`).
- RLS en Supabase es el firewall final — la action puede tener bugs pero la DB no autoriza cosas que no debe.
- Retornar objetos `{ data } | { error }` para que el cliente distinga.
- `revalidatePath` cuando la mutación afecta listados cached.

## Estado

⏸ **Stubs maqueta.** El árbol del README ya existe (`auth.ts`,
`members.ts`, `listings.ts`, `moderation.ts`) pero las funciones
son stubs contractuales: validan input, devuelven
`{ data } | { error }`, y delegan la mutación real al store del
cliente. Cuando llegue Supabase:

1. Cada stub reemplaza su body por queries
   `supabase.from(...).insert/update/select(...)`.
2. RLS cubre los permisos — la action puede validar menos.
3. Se quita la dependencia de `lib/maqueta.ts` (la flag deja de
   ser necesaria; todo pasa por Supabase Auth + RLS).
4. Los componentes admin dejan de llamar al store cliente y pasan
   a llamar a estas actions.

## Importación — sin barrels

Cada action se importa desde su archivo puntual:

```ts
import { createListing } from '@/app/actions/listings';
```

**No** hay un barrel `app/actions/index.ts`. Los barrels de `'use
server'` rompen el tree-shaking con React Compiler 19 / Next 16
porque hacen entrar al bundle el módulo entero aunque un componente
importe solo una función. Importar siempre desde el archivo concreto.

No hay tests automatizados en el proyecto (ver `AGENTS.md` §"What
NOT to do" y la regla explícita del usuario). La verificación se
hace con `pnpm run build` + smoke test manual en `pnpm run dev`.
