'use client';
import { useMemo } from 'react';

import { Table } from '@heroui/react';

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

// Tabla de auditoría append-only — todas las acciones del panel pasan por acá.
// Producción: Supabase + RLS que impide UPDATE/DELETE. Built sobre HeroUI v3 Table.
export function AuditLog() {
  const entries = useMarketplaceStore((s) => s.audit);
  const members = useAuthStore((s) => s.members);
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members],
  );

  return (
    <Table aria-label="Registro de auditoría">
      <Table.ScrollContainer>
        <Table.Content className="min-w-150">
          <Table.Header>
            <Table.Column isRowHeader>Fecha</Table.Column>
            <Table.Column>Actor</Table.Column>
            <Table.Column>Acción</Table.Column>
            <Table.Column>Nota</Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <p className="text-default-600 py-12 text-center text-sm">
                Todavía no hay acciones registradas.
              </p>
            )}
          >
            {entries.map((entry) => {
              const actor = memberById.get(entry.actorId);
              return (
                <Table.Row key={entry.id} id={entry.id}>
                  <Table.Cell className="text-default-600 text-xs whitespace-nowrap">
                    {formatDate(entry.createdAt)}
                  </Table.Cell>
                  <Table.Cell>
                    {actor
                      ? `${actor.fullName} ${actor.lastInitial}.`
                      : entry.actorId}
                  </Table.Cell>
                  <Table.Cell>{entry.action}</Table.Cell>
                  <Table.Cell className="text-default-600 text-xs">
                    {entry.note || '—'}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
