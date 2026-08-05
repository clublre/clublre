'use client';

// Store de auth para la maqueta — simula la sesión sin backend real.
// Persiste en localStorage (sólo client) para que un refresh mantenga
// al usuario logueado. En producción este archivo se reemplaza por
// cookies httpOnly + un Server Component que llame a `auth.getUser()`
// desde Supabase.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  type Member,
  type Role,
  type AccountStatus,
  seedMembers,
} from '@/data/marketplace';

export interface AuthSession {
  memberId: string;
  /** Snapshot del miembro al momento de login — la página puede
   *  re-leer el estado fresco del store por si la comisión cambió
   *  el rol en otra sesión. */
  snapshot: Member;
}

export interface AuthState {
  /** Miembros del club — sembrados + cualquier alta nueva que se
   *  haya agregado en la sesión. */
  members: ReadonlyArray<Member>;
  /** Sesión activa — `null` si nadie está logueado. */
  session: AuthSession | null;

  /** Helpers expuestos para los componentes. */
  getMember: (id: string) => Member | undefined;
  currentMember: () => Member | null;

  /** Acciones de la maqueta. */
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  signInWithEmail: (email: string) => Promise<{ ok: boolean; error?: string }>;
  /** Login directo como un miembro específico — sólo para la maqueta,
   *  permite saltar entre socio / moderador / admin sin backend. */
  signInAs: (memberId: string) => { ok: boolean; error?: string };
  signOut: () => void;

  applyForMembership: (input: {
    fullName: string;
    email: string;
    zone: string;
    memberId: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  approveMember: (
    memberId: string,
    approverId: string,
  ) => { ok: boolean; error?: string };
  rejectMember: (
    memberId: string,
    approverId: string,
    note: string,
  ) => { ok: boolean; error?: string };
  suspendMember: (
    memberId: string,
    actorId: string,
    note: string,
  ) => { ok: boolean; error?: string };
}

const STORAGE_KEY = 'clublre:auth-mock-v1';

const storage = createJSONStorage(() => {
  // SSR guard — Zustand sólo accede a `window` cuando hidrata.
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }
  // `localStorage` lanza en Safari/Firefox private mode y al exceder
  // la cuota. Wrappeamos cada método para que un fallo de
  // persistencia no rompa la hidratación de la app.
  return {
    getItem: (name) => {
      try {
        return window.localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        window.localStorage.setItem(name, value);
      } catch {
        // Sin-op: seguimos sin persistir.
      }
    },
    removeItem: (name) => {
      try {
        window.localStorage.removeItem(name);
      } catch {
        // Sin-op.
      }
    },
  };
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      members: seedMembers,
      session: null,

      getMember: (id) => get().members.find((m) => m.id === id),
      currentMember: () => {
        const s = get().session;
        if (!s) return null;
        // Devolvemos el miembro fresco del store para reflejar
        // aprobaciones / suspensiones que ocurran en la sesión.
        return get().members.find((m) => m.id === s.memberId) ?? s.snapshot;
      },

      async signInWithGoogle() {
        // Mock: simulamos que el socio de Google es siempre
        // `member-1`. En la versión real, Google OAuth devuelve
        // un id que mapeamos a un `member.id`.
        await new Promise((r) => setTimeout(r, 600));
        const member = get().members.find((m) => m.id === 'member-1');
        if (!member) return { ok: false, error: 'Cuenta no encontrada' };
        if (member.accountStatus === 'suspended') {
          return {
            ok: false,
            error: 'Tu cuenta está suspendida. Contactá a la comisión.',
          };
        }
        set({ session: { memberId: member.id, snapshot: member } });
        return { ok: true };
      },

      signInAs(memberId) {
        const member = get().members.find((m) => m.id === memberId);
        if (!member) {
          return { ok: false, error: `Miembro ${memberId} no existe.` };
        }
        if (member.accountStatus === 'suspended') {
          return {
            ok: false,
            error: 'Esta cuenta está suspendida. Contactá a la comisión.',
          };
        }
        set({ session: { memberId: member.id, snapshot: member } });
        return { ok: true };
      },

      async signInWithEmail(email) {
        await new Promise((r) => setTimeout(r, 600));
        const normalized = email.trim().toLowerCase();
        const member = get().members.find(
          (m) => m.email.toLowerCase() === normalized,
        );
        if (!member) {
          return {
            ok: false,
            error: 'No encontramos una cuenta con ese email.',
          };
        }
        if (member.accountStatus === 'pending') {
          // Permite login pero conserva el estado — el layout
          // redirige a la pantalla "pendiente".
          set({ session: { memberId: member.id, snapshot: member } });
          return { ok: true };
        }
        if (member.accountStatus === 'rejected') {
          return {
            ok: false,
            error: 'Tu solicitud fue rechazada. Contactá a la comisión.',
          };
        }
        if (member.accountStatus === 'suspended') {
          return {
            ok: false,
            error: 'Tu cuenta está suspendida. Contactá a la comisión.',
          };
        }
        set({ session: { memberId: member.id, snapshot: member } });
        return { ok: true };
      },

      signOut() {
        set({ session: null });
      },

      async applyForMembership({ fullName, email, zone, memberId }) {
        await new Promise((r) => setTimeout(r, 500));
        const exists = get().members.some(
          (m) => m.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (exists) {
          return {
            ok: false,
            error:
              'Ya hay una cuenta con ese email. Iniciá sesión en lugar de registrarte.',
          };
        }
        const newMember: Member = {
          id: memberId,
          fullName: fullName.trim(),
          lastInitial: (fullName.trim().split(/\s+/).pop() ?? '?').charAt(0),
          email: email.trim().toLowerCase(),
          memberSince: new Date().toISOString().slice(0, 10),
          zone: zone.trim(),
          accountStatus: 'pending',
          role: 'member',
          approvedBy: null,
          approvedAt: null,
        };
        set((s) => ({ members: [...s.members, newMember] }));
        return { ok: true };
      },

      approveMember(memberId, approverId) {
        const approver = get().members.find((m) => m.id === approverId);
        if (
          !approver ||
          (approver.role !== 'admin' && approver.role !== 'moderator')
        ) {
          return { ok: false, error: 'No tenés permisos para aprobar.' };
        }
        set((s) => ({
          members: s.members.map((m) =>
            m.id === memberId
              ? {
                  ...m,
                  accountStatus: 'active' as AccountStatus,
                  approvedBy: approverId,
                  approvedAt: new Date().toISOString(),
                }
              : m,
          ),
        }));
        return { ok: true };
      },

      rejectMember(memberId, approverId, _note) {
        const approver = get().members.find((m) => m.id === approverId);
        if (
          !approver ||
          (approver.role !== 'admin' && approver.role !== 'moderator')
        ) {
          return { ok: false, error: 'No tenés permisos para rechazar.' };
        }
        set((s) => ({
          members: s.members.map((m) =>
            m.id === memberId
              ? {
                  ...m,
                  accountStatus: 'rejected' as AccountStatus,
                  approvedBy: approverId,
                  approvedAt: new Date().toISOString(),
                }
              : m,
          ),
        }));
        return { ok: true };
      },

      suspendMember(memberId, actorId, _note) {
        const actor = get().members.find((m) => m.id === actorId);
        if (!actor || actor.role !== 'admin') {
          return {
            ok: false,
            error: 'Solo los administradores pueden suspender.',
          };
        }
        set((s) => ({
          members: s.members.map((m) =>
            m.id === memberId
              ? { ...m, accountStatus: 'suspended' as AccountStatus }
              : m,
          ),
          session: s.session?.memberId === memberId ? null : s.session,
        }));
        return { ok: true };
      },
    }),
    {
      name: STORAGE_KEY,
      storage,
      // Sólo persistimos la sesión — los miembros sembrados se
      // recargan desde `seedMembers` cada vez que se monta el
      // store, manteniendo el mock sincronizado con el código.
      partialize: (state) => ({ session: state.session }),
    },
  ),
);

export const useCurrentMember = (): Member | null =>
  useAuthStore((s) => s.currentMember());

export const useRole = (): Role | null => {
  const m = useCurrentMember();
  return m?.role ?? null;
};

export const useAccountStatus = (): AccountStatus | null => {
  const m = useCurrentMember();
  return m?.accountStatus ?? null;
};
