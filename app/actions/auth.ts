'use server';

// Maqueta: todas las "Server Actions" aquí terminan mutando los
// stores del cliente via un helper que sincroniza persist en
// localStorage. Sin Supabase real todavía — el patrón es el mismo
// que cuando llegue (validar input, mutar, revalidar, retornar
// { data } | { error }) — solo que el destino final de la mutación
// es localStorage y no Postgres.
//
// Reglas del README en app/actions/README.md:
//   • `'use server'` arriba
//   • validar inputs (Zod en prod, simple trim/length acá)
//   • auth check (delegado a la sesión del store en maqueta)
//   • retornar { data } | { error }
//   • revalidatePath cuando hay listados cacheados

import { revalidatePath } from 'next/cache';

// ---------- helpers ----------

type Result<T> = { data: T } | { error: string };

function err(message: string): { error: string } {
  return { error: message };
}

/** Lee el snapshot actual de un store desde el cliente.
 *  Si la maqueta no está habilitada (NEXT_PUBLIC_MAQUETA=false),
 *  devolvemos `{ error }` para que los callers se comporten como
 *  producción. */
function isMaquetaServer(): boolean {
  const v = process.env['NEXT_PUBLIC_MAQUETA'];
  return v === undefined || v === 'true' || v === '1';
}

// ---------- auth ----------

export async function signOut(): Promise<Result<{ ok: true }>> {
  if (!isMaquetaServer()) {
    return err('Auth no disponible en producción todavía.');
  }
  // El cliente ya tiene `useAuthStore.signOut()` — esta action
  // existe para documentar el patrón y porque un botón de logout
  // puede ser un form sin JS.
  revalidatePath('/');
  return { data: { ok: true } };
}
