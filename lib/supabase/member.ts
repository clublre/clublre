// Fila Postgres (`members`) → tipo `Member` que ya usa la UI/maqueta.
// La DB usa snake_case; el front usa camelCase.

import type { AccountStatus, Member, Role } from '@/data/marketplace';

export interface MemberRow {
  id: string;
  full_name: string;
  last_initial: string;
  email: string;
  zone: string;
  member_since: string;
  account_status: AccountStatus;
  role: Role;
  approved_by: string | null;
  approved_at: string | null;
}

/** Columnas pedidas en cada select — evitar `select('*')` a ciegas. */
export const MEMBER_SELECT =
  'id, full_name, last_initial, email, zone, member_since, account_status, role, approved_by, approved_at';

export function memberFromRow(row: MemberRow): Member {
  return {
    id: row.id,
    fullName: row.full_name,
    lastInitial: row.last_initial,
    email: row.email,
    memberSince: row.member_since,
    zone: row.zone,
    accountStatus: row.account_status,
    role: row.role,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
  };
}
