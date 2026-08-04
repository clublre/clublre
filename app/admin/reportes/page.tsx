'use client';

import { AdminShell } from '@/components/pages/admin/AdminShell';
import { ReportsQueue } from '@/components/pages/admin/ReportsQueue';

export default function AdminReportsPage() {
  return (
    <AdminShell
      description="Revisá cada reporte. Podés ocultar la publicación o desestimar el reporte."
      eyebrow="Reportes"
      heading="Reportes abiertos"
    >
      <ReportsQueue />
    </AdminShell>
  );
}
