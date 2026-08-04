'use client';

import dynamic from 'next/dynamic';

// `ssr: false` requiere client component — este wrapper existe
// únicamente para alojar el dynamic import. `OrgChart` es client
// también, pero cargarlo via dynamic mantiene el bundle del section
// fuera del primer paint y le da un placeholder consistente.
const OrgChart = dynamic(
  () => import('./OrgChart').then((m) => m.OrgChart),
  {
    loading: () => (
      <div className="bg-surface shadow-club h-[520px] animate-pulse rounded-2xl border border-default-200" />
    ),
    ssr: false,
  },
);

export function CommissionChart() {
  return <OrgChart />;
}