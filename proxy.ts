// Refresca la cookie de sesión de Supabase en cada request.
// En Next 16 el archivo se llama `proxy.ts` (es lo que antes era `middleware.ts`).
// Ver docs/AUTH.md.

import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { getSupabasePublicEnv } from '@/lib/supabase/env';

export async function proxy(request: NextRequest) {
  const env = getSupabasePublicEnv();
  // Si no hay envvars de Supabase, no bloquear
  if (!env) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        // Hay que mutar request + response para que el refresh llegue al browser.
        toSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Revalida el JWT. si expiró, setAll escribe la cookie nueva.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  // Excluir estáticos del proxy (le dice al proxy en qué no URLs debe correr.)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
