// Lectura tipada de env públicas de Supabase.
// Indexamos `process.env['…']` por `noPropertyAccessFromIndexSignature`.
// `get*` no tira: permite que el sitio corra sin Supabase (solo maqueta).
// `require*` tira: para paths que ya decidieron usar Auth (login/signup).

export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

/** `null` si faltan vars — no romper home/marketplace mock. */
export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const anonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** Para Server Actions / clients que no tienen sentido sin proyecto. */
export function requireSupabasePublicEnv(): SupabasePublicEnv {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  return env;
}
