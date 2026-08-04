'use client';

import { AdminShell } from '@/components/pages/admin/AdminShell';
import { MembersTable } from '@/components/pages/admin/MembersTable';

export default function AdminUsersPage() {
  return (
    <AdminShell
      description="Aprobá, rechazá o suspendé solicitudes de alta. Los cambios quedan registrados en la auditoría."
      eyebrow="Socios"
      heading="Gestión de socios"
    >
      <MembersTable />
    </AdminShell>
  );
}
