'use client';

import { AdminShell } from '@/components/pages/admin/AdminShell';
import { CategoriesManager } from '@/components/pages/admin/CategoriesManager';

export default function AdminCategoriesPage() {
  return (
    <AdminShell
      description="Lista de categorías que pueden usar los socios al publicar."
      eyebrow="Catálogo"
      heading="Categorías del marketplace"
    >
      <CategoriesManager />
    </AdminShell>
  );
}
