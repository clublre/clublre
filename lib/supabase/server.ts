// Cliente Supabase para Server Components y Server Actions.
// La sesión viaja en cookies httpOnly (no localStorage) — ver docs/AUTH.md.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { requireSupabasePublicEnv } from '@/lib/supabase/env';

export async function createClient() {
  const { url, anonKey } = requireSupabasePublicEnv();
  // Next 16: `cookies()` es async.
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // En un Server Component puro no se pueden setear cookies.
          // El refresh lo hace `proxy.ts` en el edge.
        }
      },
    },
  });
}
