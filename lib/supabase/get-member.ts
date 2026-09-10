// "¿Quién soy?" en el servidor: cookie Auth + fila `members`.
// Usar `getUser()` (pega a Auth), no `getSession()` (puede estar stale).

import { createClient } from '@/lib/supabase/server';
import { getSupabasePublicEnv } from '@/lib/supabase/env';
import {
  MEMBER_SELECT,
  memberFromRow,
  type MemberRow,
} from '@/lib/supabase/member';
import type { Member } from '@/data/marketplace';

/** Socio de la cookie, o `null` si no hay proyecto / sesión / ficha. */
export async function getCurrentMember(): Promise<Member | null> {
  // Sin env: maqueta pura, no intentamos hablar con Supabase.
  if (!getSupabasePublicEnv()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('members')
    .select(MEMBER_SELECT)
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return memberFromRow(data as MemberRow);
}
