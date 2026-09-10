'use server';

// Server Actions de auth — corren en el servidor.
// Ver docs/AUTH.md: Auth (cookie) ≠ ficha de socio (`members.account_status`).

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { getSupabasePublicEnv } from '@/lib/supabase/env';
import { routes } from '@/lib/routes';
import type { AccountStatus } from '@/data/marketplace';

export interface AuthActionResult {
  error: string | null;
}

const lastInitialFromName = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);
  const last = parts[parts.length - 1] ?? '?';
  return (last.charAt(0) || '?').toUpperCase();
};

const read = (formData: FormData, key: string): string =>
  String(formData.get(key) ?? '').trim();

/**
 * Alta: crea user en Auth + fila `members` en `pending`.
 * Redirect a `/cuenta/estado`. Errores → `{ error }` para el form.
 */
export async function register(
  formData: FormData,
): Promise<AuthActionResult> {
  const fullName = read(formData, 'fullName');
  const email = read(formData, 'email').toLowerCase();
  const zone = read(formData, 'zone');
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirmPassword') ?? '');
  const note = read(formData, 'note');

  if (!fullName || !email || !zone || !password) {
    return { error: 'Completá nombre, email, zona y contraseña.' };
  }
  if (password.length < 6) {
    return { error: 'La contraseña tiene que tener al menos 6 caracteres.' };
  }
  if (password !== confirm) {
    return { error: 'Las contraseñas no coinciden.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: error.message };
  }
  const user = data.user;
  if (!user) {
    return {
      error:
        'No pudimos crear la cuenta. Si el email ya existe, iniciá sesión.',
    };
  }

  // Mismo UUID que Auth — FK en 0001_members.sql.
  // Requiere confirm-email OFF en local: si no hay sesión, RLS bloquea el insert.
  const { error: insertError } = await supabase.from('members').insert({
    id: user.id,
    full_name: fullName,
    last_initial: lastInitialFromName(fullName),
    email,
    zone,
    account_status: 'pending',
    role: 'member',
    application_note: note || null,
  });

  if (insertError) {
    return {
      error:
        insertError.message ||
        'La cuenta de acceso se creó pero el perfil de socio falló. Escribinos a la comisión.',
    };
  }

  redirect(routes.accountStatus);
}

/**
 * Login email+password. Rama según `members.account_status`.
 * No toca el store mock — los atajos de /login siguen aparte.
 */
export async function login(formData: FormData): Promise<AuthActionResult> {
  const email = read(formData, 'email').toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Completá email y contraseña.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: 'Email o contraseña incorrectos.' };
  }
  const user = data.user;
  if (!user) {
    return { error: 'No pudimos iniciar sesión.' };
  }

  const { data: row } = await supabase
    .from('members')
    .select('account_status')
    .eq('id', user.id)
    .maybeSingle();

  const status = (row?.['account_status'] ?? null) as AccountStatus | null;

  if (status === 'suspended') {
    return { error: 'Tu cuenta está suspendida. Contactá a la comisión.' };
  }
  if (status === 'rejected') {
    return { error: 'Tu solicitud fue rechazada. Contactá a la comisión.' };
  }
  if (status === 'pending' || !status) {
    redirect(routes.accountStatus);
  }

  redirect(routes.account);
}

/**
 * Borra la cookie de Supabase. El caller también debe `signOut` del mock
 * (Zustand), si no la maqueta te deja “logueado” en localStorage.
 */
export async function logout(): Promise<void> {
  if (getSupabasePublicEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect(routes.home);
}
