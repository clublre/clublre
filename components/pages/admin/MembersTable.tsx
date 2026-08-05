'use client';

import { useState } from 'react';
import { Button, Chip } from '@heroui/react';

import { useAuthStore, useCurrentMember } from '@/stores/auth-store';
import { type Member } from '@/data/marketplace';
import { RoleBadge, StatusBadge } from '@/components/atoms/StatusBadge';

const isAdminRole = (m: Member) => m.role === 'admin';

const filterLabel = {
  all: 'Todos',
  pending: 'Pendientes',
  active: 'Activos',
  suspended: 'Suspendidos',
  rejected: 'Rechazados',
} as const;

type Filter = keyof typeof filterLabel;

const FILTER_OPTIONS: ReadonlyArray<Filter> = [
  'all',
  'pending',
  'active',
  'suspended',
  'rejected',
];

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));

/** Tabla de miembros para que la comisión apruebe, rechace o
 *  suspenda cuentas. */
export function MembersTable() {
  const members = useAuthStore((s) => s.members);
  const approve = useAuthStore((s) => s.approveMember);
  const reject = useAuthStore((s) => s.rejectMember);
  const suspend = useAuthStore((s) => s.suspendMember);
  const currentMember = useCurrentMember();
  const [filter, setFilter] = useState<Filter>('all');
  // `members` ya está suscripto en el componente principal.
  // Si en el futuro se hace más complejo, considerar Map.

  const visible = members.filter((m) =>
    filter === 'all' ? true : m.accountStatus === filter,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((f) => (
          <Button
            key={f}
            className="font-medium"
            size="sm"
            variant={filter === f ? 'primary' : 'outline'}
            onPress={() => setFilter(f)}
          >
            {filterLabel[f]}
          </Button>
        ))}
      </div>

      <div className="bg-surface shadow-club overflow-hidden rounded-2xl">
        {visible.length === 0 ? (
          <div className="text-default-600 px-6 py-12 text-center text-sm">
            No hay socios en este estado.
          </div>
        ) : (
        <table className="w-full text-left text-sm">
          <thead className="text-default-500 text-xs tracking-wider uppercase">
            <tr>
              <th className="px-4 py-3 font-medium" scope="col">
                Nombre
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                Email
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                Rol
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                Estado
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                Antigüedad
              </th>
              <th className="px-4 py-3 text-right font-medium" scope="col">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-default-200/60 divide-y">
            {visible.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium">
                  {m.fullName} {m.lastInitial}.
                </td>
                <td className="text-default-600 px-4 py-3">{m.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={m.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={m.accountStatus} />
                </td>
                <td className="text-default-600 px-4 py-3 text-xs">
                  {formatDate(m.memberSince)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {m.accountStatus === 'pending' && (
                      <>
                        <Button
                          className="font-semibold"
                          size="sm"
                          variant="primary"
                          onPress={() =>
                            currentMember && approve(m.id, currentMember.id)
                          }
                        >
                          Aprobar
                        </Button>
                        <Button
                          className="font-semibold"
                          size="sm"
                          variant="danger"
                          onPress={() =>
                            currentMember &&
                            reject(m.id, currentMember.id, 'Sin padrón')
                          }
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    {m.accountStatus === 'active' &&
                      !isAdminRole(m) &&
                      currentMember?.role === 'admin' && (
                        <Button
                          className="font-semibold"
                          size="sm"
                          variant="danger"
                          onPress={() =>
                            currentMember &&
                            suspend(m.id, currentMember.id, 'Suspendido')
                          }
                        >
                          Suspender
                        </Button>
                      )}
                    {m.accountStatus === 'suspended' && (
                      <Button
                        className="font-semibold"
                        size="sm"
                        variant="outline"
                        onPress={() =>
                          currentMember && approve(m.id, currentMember.id)
                        }
                      >
                        Reactivar
                      </Button>
                    )}
                    {m.accountStatus === 'rejected' && (
                      <Chip
                        className="tracking-wider uppercase"
                        color="default"
                        size="sm"
                        variant="soft"
                      >
                        Cerrado
                      </Chip>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
