// Cliente browser. Hoy casi no se usa: login email va por Server Actions.
// Queda para OAuth (Google) y Realtime más adelante.

import { createBrowserClient } from '@supabase/ssr';

import { requireSupabasePublicEnv } from '@/lib/supabase/env';

export function createClient() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createBrowserClient(url, anonKey);
}
