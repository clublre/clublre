'use server';

// Maqueta: validation mínima (no usamos Zod todavía — el patrón
// documentado en app/actions/README.md se aplica idéntico cuando
// llegue Supabase real, solo cambiando el destino de la mutación).
//
// Todas las mutaciones de aprobación/rechazo/suspensión viven hoy
// en el store cliente (`useAuthStore`) porque la maqueta corre
// 100% en el browser. Esta action existe para que el caller pueda
// lanzar el flujo desde un `<form action={...}>` incluso sin JS y
// para dejar listo el esqueleto del contrato.

import { revalidatePath } from 'next/cache';

import { isMaqueta } from '@/lib/maqueta';

type Result<T> = { data: T } | { error: string };

function err(message: string): { error: string } {
  return { error: message };
}

// ---------- applyForMembership ----------

export interface ApplyInput {
  fullName: string;
  email: string;
  zone: string;
  memberId: string;
}

export async function applyForMembership(
  input: ApplyInput,
): Promise<Result<{ id: string }>> {
  if (!isMaqueta()) {
    return err('Registro no disponible todavía.');
  }
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const zone = input.zone.trim();

  if (fullName.length < 2 || fullName.length > 80) {
    return err('El nombre tiene que tener entre 2 y 80 caracteres.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return err('Email inválido.');
  }
  if (zone.length < 2) {
    return err('Indicá una zona válida.');
  }

  revalidatePath('/registro');
  return { data: { id: input.memberId } };
}

// ---------- approveMember / rejectMember / suspendMember ----------
// Estas mutations hoy viven en `useAuthStore` (Zustand cliente).
// Cuando llegue Supabase, las movemos acá y los componentes admin
// las llaman vía `<form action>` o `useActionState`. Por ahora
// este archivo sólo documenta el contrato.

export async function approveMember(
  _memberId: string,
  _approverId: string,
): Promise<Result<{ ok: true }>> {
  if (!isMaqueta()) return err('Aprobación no disponible todavía.');
  revalidatePath('/admin/usuarios');
  return { data: { ok: true } };
}

export async function rejectMember(
  _memberId: string,
  _approverId: string,
  _note: string,
): Promise<Result<{ ok: true }>> {
  if (!isMaqueta()) return err('Rechazo no disponible todavía.');
  revalidatePath('/admin/usuarios');
  return { data: { ok: true } };
}

export async function suspendMember(
  _memberId: string,
  _actorId: string,
  _note: string,
): Promise<Result<{ ok: true }>> {
  if (!isMaqueta()) return err('Suspensión no disponible todavía.');
  revalidatePath('/admin/usuarios');
  return { data: { ok: true } };
}
