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

⏸ Vacía — se pobla en Semana 2-3 del roadmap (STACK.md §8).
