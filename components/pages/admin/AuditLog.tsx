'use client';
import { useMemo } from 'react';

import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useAuthStore } from '@/stores/auth-store';

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

/** Tabla de auditoría append-only — todas las acciones del
 *  panel pasan por acá. En producción la tabla vive en Supabase
 *  con RLS que impide UPDATE / DELETE. */
export function AuditLog() {
  const entries = useMarketplaceStore((s) => s.audit);
  const members = useAuthStore((s) => s.members);
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members],
  );

  if (entries.length === 0) {
    return (
      <p className="text-default-600 text-sm">
        Todavía no hay acciones registradas.
      </p>
    );
  }

  return (
    <div className="bg-surface shadow-club overflow-hidden rounded-2xl">
      <table className="w-full text-left text-sm">
        <thead className="text-default-500 text-xs tracking-wider uppercase">
          <tr>
            <th className="px-4 py-3 font-medium" scope="col">
              Fecha
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              Actor
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              Acción
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              Nota
            </th>
          </tr>
        </thead>
        <tbody className="divide-default-200/60 divide-y">
          {entries.map((entry) => {
            const actor = memberById.get(entry.actorId);
            return (
              <tr key={entry.id}>
                <td className="text-default-600 px-4 py-3 text-xs whitespace-nowrap">
                  {formatDate(entry.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {actor
                    ? `${actor.fullName} ${actor.lastInitial}.`
                    : entry.actorId}
                </td>
                <td className="px-4 py-3">{entry.action}</td>
                <td className="text-default-600 px-4 py-3 text-xs">
                  {entry.note || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
