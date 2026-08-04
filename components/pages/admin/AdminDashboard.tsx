'use client';

import NextLink from 'next/link';
import type { Route } from 'next';
import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useAuthStore } from '@/stores/auth-store';
import { routes } from '@/lib/routes';

interface StatCardProps {
  label: string;
  value: number;
  hint?: string;
  href?: Route;
}

function StatCard({ label, value, hint, href }: StatCardProps) {
  const body = (
    <div className="bg-surface shadow-club rounded-2xl p-5">
      <p className="text-default-500 text-xs tracking-wider uppercase">
        {label}
      </p>
      <p className="text-foreground mt-2 text-3xl font-bold">{value}</p>
      {hint ? <p className="text-default-500 mt-1 text-xs">{hint}</p> : null}
    </div>
  );
  if (href) {
    return (
      <NextLink
        className="block transition-transform hover:-translate-y-0.5"
        href={href}
      >
        {body}
      </NextLink>
    );
  }
  return body;
}

/** Dashboard admin — métricas de alto nivel y enlaces a secciones. */
export function AdminDashboard() {
  const members = useAuthStore((s) => s.members);
  const listings = useMarketplaceStore((s) => s.listings);
  const reports = useMarketplaceStore((s) => s.reports);

  const pendingMembers = members.filter(
    (m) => m.accountStatus === 'pending',
  ).length;
  const activeMembers = members.filter(
    (m) => m.accountStatus === 'active',
  ).length;
  const pendingListings = listings.filter(
    (l) => l.status === 'pending_review',
  ).length;
  const openReports = reports.filter((r) => r.status === 'open').length;
  const publishedListings = listings.filter(
    (l) => l.status === 'published' || l.status === 'reserved',
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        hint="Esperando aprobación de la comisión"
        href={routes.adminUsers}
        label="Socios pendientes"
        value={pendingMembers}
      />
      <StatCard
        hint="Activos en el club"
        label="Socios activos"
        value={activeMembers}
      />
      <StatCard
        hint="Para revisar antes de publicar"
        href={routes.adminMarketplace}
        label="Publicaciones en revisión"
        value={pendingListings}
      />
      <StatCard
        hint="Visibles en el marketplace"
        label="Publicaciones activas"
        value={publishedListings}
      />
      <StatCard
        hint="Necesitan moderación"
        href={routes.adminReports}
        label="Reportes abiertos"
        value={openReports}
      />
    </div>
  );
}
