'use client';

import { AdminShell } from '@/components/pages/admin/AdminShell';
import { AdminDashboard } from '@/components/pages/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <AdminShell
      description="Vista rápida del estado del club y la comunidad."
      eyebrow="Panel de administración"
      heading="Resumen general"
    >
      <AdminDashboard />
    </AdminShell>
  );
}
