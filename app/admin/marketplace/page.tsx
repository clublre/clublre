'use client';

import { Suspense } from 'react';

import { AdminShell } from '@/components/pages/admin/AdminShell';
import { ListingsModeration } from '@/components/pages/admin/ListingsModeration';

export default function AdminMarketplacePage() {
  return (
    <AdminShell
      description="Aprobá la primera publicación de cada socio y moderá las denunciadas."
      eyebrow="Marketplace"
      heading="Publicaciones"
    >
      {/* nuqs requiere Suspense boundary para `useSearchParams` en
          App Router. Lo envolvemos acá en vez de un loading.tsx para
          no agregar otro file. */}
      <Suspense fallback={null}>
        <ListingsModeration />
      </Suspense>
    </AdminShell>
  );
}
