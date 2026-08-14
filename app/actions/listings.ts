'use server';

// Maqueta: las publicaciones se persisten en `useMarketplaceStore`
// (Zustand cliente). Esta action expone el contrato del README
// para los casos en que un componente quiera server-mutate
// (ej. un `<form action={createListing}>` sin JS).
//
// Validación mínima: longitud, presence, formato de precio. El día
// que enchufemos Supabase, este mismo schema se traduce a Zod y
// `supabase.from('listings').insert(...)`.

import { revalidatePath } from 'next/cache';

import { isMaqueta } from '@/lib/maqueta';

type Result<T> = { data: T } | { error: string };

function err(message: string): { error: string } {
  return { error: message };
}

export interface CreateListingInput {
  title: string;
  description: string;
  price: number | null;
  categoryId: string;
  zone: string;
  contactHandle: string;
}

export async function createListing(
  input: CreateListingInput,
  _actorId: string,
): Promise<Result<{ id: string }>> {
  if (!isMaqueta()) {
    return err('Creación de publicaciones no disponible todavía.');
  }
  const title = input.title.trim();
  const description = input.description.trim();

  if (title.length < 3 || title.length > 120) {
    return err('El título tiene que tener entre 3 y 120 caracteres.');
  }
  if (description.length < 10 || description.length > 2000) {
    return err('La descripción tiene que tener entre 10 y 2000 caracteres.');
  }
  if (!input.categoryId) return err('Elegí una categoría.');
  if (input.contactHandle.trim().length < 3) {
    return err('Indicá un contacto válido (WhatsApp o email).');
  }

  revalidatePath('/marketplace');
  return { data: { id: `pending-${Date.now().toString(36)}` } };
}

export async function updateListing(
  id: string,
  _patch: Partial<CreateListingInput>,
  _actorId: string,
): Promise<Result<{ ok: true }>> {
  if (!isMaqueta()) return err('Edición no disponible todavía.');
  if (!id) return err('ID requerido.');
  revalidatePath(`/marketplace/${id}`);
  return { data: { ok: true } };
}

export async function archiveListing(
  id: string,
  _actorId: string,
): Promise<Result<{ ok: true }>> {
  if (!isMaqueta()) return err('Archivar no disponible todavía.');
  if (!id) return err('ID requerido.');
  revalidatePath('/marketplace');
  return { data: { ok: true } };
}

export async function reportListing(
  listingId: string,
  reason: string,
  detail: string,
  _reporterId: string,
): Promise<Result<{ ok: true }>> {
  if (!isMaqueta()) return err('Reportes no disponibles todavía.');
  if (!listingId) return err('ID requerido.');
  if (reason.length < 2) return err('Indicá un motivo.');
  if (detail.length > 2000) return err('Detalle demasiado largo.');
  revalidatePath('/admin/reportes');
  return { data: { ok: true } };
}
