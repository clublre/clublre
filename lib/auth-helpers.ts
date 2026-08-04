// Helpers de auth compartidos por cliente y servidor. Estos wrappean
// el store para que un componente cliente pueda pedir "el usuario
// actual" sin tener que importar Zustand directamente. La página
// puede usar estos helpers para ramificar UI o lanzar redirects.

import 'client-only';

import { useSyncExternalStore } from 'react';

import { useAuthStore } from '@/stores/auth-store';

/** Devuelve `true` si el usuario actual tiene rol `admin`. */
export function useIsAdmin(): boolean {
  return useAuthStore((s) => s.currentMember()?.role === 'admin');
}

/** Devuelve `true` si el usuario actual tiene rol `admin` o
 *  `moderator`. */
export function useCanModerate(): boolean {
  return useAuthStore((s) => {
    const role = s.currentMember()?.role;
    return role === 'admin' || role === 'moderator';
  });
}

/** `false` durante SSR y en el primer render del cliente. `true`
 *  después del primer render. Implementado con `useSyncExternalStore`
 *  siguiendo la recomendación del equipo de React para detectar el
 *  mount sin disparar el lint de "setState in effect". Útil para
 *  evitar hydration mismatches cuando el árbol depende de estado
 *  persistido en localStorage (sesión, rol, etc.). */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
