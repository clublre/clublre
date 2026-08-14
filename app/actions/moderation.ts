'use server';

// Maqueta: la moderación vive hoy en `useMarketplaceStore`.
// Stubs contractuales para que los componentes admin puedan
// consumir Server Actions cuando enchufemos Supabase.

import { revalidatePath } from 'next/cache';

import { isMaqueta } from '@/lib/maqueta';

type Result<T> = { data: T } | { error: string };

function err(message: string): { error: string } {
  return { error: message };
}

export async function resolveReport(
  reportId: string,
  action: 'dismiss' | 'hide-listing',
  note: string,
  _actorId: string,
): Promise<Result<{ ok: true }>> {
  if (!isMaqueta()) return err('Moderación no disponible todavía.');
  if (!reportId) return err('ID requerido.');
  if (note.length > 2000) return err('Nota demasiado larga.');
  revalidatePath('/admin/reportes');
  return { data: { ok: true } };
}

export async function setListingStatus(
  listingId: string,
  status: string,
  _actorId: string,
  note?: string,
): Promise<Result<{ ok: true }>> {
  if (!isMaqueta()) return err('Cambio de estado no disponible todavía.');
  if (!listingId) return err('ID requerido.');
  if (!status) return err('Status requerido.');
  if (note && note.length > 2000) return err('Nota demasiado larga.');
  revalidatePath('/admin/marketplace');
  return { data: { ok: true } };
}
