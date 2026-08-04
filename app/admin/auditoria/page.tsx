'use client';

import { AdminShell } from '@/components/pages/admin/AdminShell';
import { AuditLog } from '@/components/pages/admin/AuditLog';

export default function AdminAuditPage() {
  return (
    <AdminShell
      description="Bitácora append-only de todas las acciones del panel."
      eyebrow="Auditoría"
      heading="Registro de auditoría"
    >
      <AuditLog />
    </AdminShell>
  );
}
