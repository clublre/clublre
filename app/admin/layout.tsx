// Layout para /admin/*. En maqueta (NEXT_PUBLIC_MAQUETA=true) renderiza
// el children — los componentes cliente se autentican con `signInAs`
// y `useAuthStore`. Cuando Supabase esté conectado, este layout
// devuelve 404 para que el caller (el panel admin real, ahora un
// Server Component que valida sesión con `supabase.auth.getUser()`)
// se haga cargo.

import { isMaqueta } from '@/lib/maqueta';
import { notFound } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isMaqueta()) {
    notFound();
  }
  return <>{children}</>;
}
