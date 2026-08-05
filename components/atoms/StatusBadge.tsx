import { Chip } from '@heroui/react';

import type { AccountStatus, Role } from '@/data/marketplace';

const STATUS_LABEL: Record<AccountStatus, string> = {
  pending: 'Pendiente',
  active: 'Activo',
  suspended: 'Suspendido',
  rejected: 'Rechazado',
};

const STATUS_COLOR: Record<
  AccountStatus,
  'default' | 'accent' | 'warning' | 'success' | 'danger'
> = {
  pending: 'warning',
  active: 'success',
  suspended: 'danger',
  rejected: 'danger',
};

const ROLE_LABEL: Record<Role, string> = {
  member: 'Socio',
  moderator: 'Moderador',
  admin: 'Administrador',
};

/** Badge de cuenta para listados y tarjetas. Capitalized, no
 *  uppercase — más legible para nombres propios. */
export function StatusBadge({ status }: { status: AccountStatus }) {
  return (
    <Chip
      className="capitalize"
      color={STATUS_COLOR[status]}
      size="sm"
      variant="soft"
    >
      {STATUS_LABEL[status]}
    </Chip>
  );
}

/** Badge de rol — usado en Mi cuenta y panel admin. */
export function RoleBadge({ role }: { role: Role }) {
  const color = role === 'admin' || role === 'moderator' ? 'accent' : 'default';
  return (
    <Chip
      className="capitalize"
      color={color}
      size="sm"
      variant={role === 'admin' ? 'primary' : 'soft'}
    >
      {ROLE_LABEL[role]}
    </Chip>
  );
}
