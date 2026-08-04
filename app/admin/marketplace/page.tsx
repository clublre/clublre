'use client';

import { AdminShell } from '@/components/pages/admin/AdminShell';
import { ListingsModeration } from '@/components/pages/admin/ListingsModeration';

export default function AdminMarketplacePage() {
  return (
    <AdminShell
      description="Aprobá la primera publicación de cada socio y moderá las denunciadas."
      eyebrow="Marketplace"
      heading="Publicaciones"
    >
      <ListingsModeration />
    </AdminShell>
  );
}
