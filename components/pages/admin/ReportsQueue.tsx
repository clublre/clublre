'use client';
import { useMemo } from 'react';

import NextLink from 'next/link';
import { Button, Chip } from '@heroui/react';

import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  type Report,
  type ReportReason,
  findCategory,
  categories,
} from '@/data/marketplace';
import { routes } from '@/lib/routes';

const REASON_LABEL: Record<ReportReason, string> = {
  spam: 'Spam',
  scam: 'Posible estafa',
  prohibited: 'Artículo prohibido',
  harassment: 'Acoso',
  off_topic: 'No tiene que ver con el club',
  other: 'Otro',
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));

/** Cola de reportes abiertos — la comisión los revisa y decide
 *  ocultar la publicación o desestimar. */
export function ReportsQueue() {
  const reports = useMarketplaceStore((s) => s.reports);
  const resolve = useMarketplaceStore((s) => s.resolveReport);
  const listingById = useMarketplaceStore((s) => s.listingById);
  const members = useAuthStore((s) => s.members);
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members],
  );
  const currentMember = useAuthStore((s) => s.currentMember());

  const open = reports.filter((r) => r.status === 'open');

  if (open.length === 0) {
    return (
      <p className="text-default-600 text-sm">No hay reportes abiertos.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {open.map((report: Report) => {
        const listing = listingById(report.listingId);
        const category = listing
          ? findCategory(listing.categoryId, categories)
          : null;
        return (
          <li
            key={report.id}
            className="bg-surface shadow-club rounded-xl p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 grow">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <Chip
                    className="capitalize"
                    color="warning"
                    size="sm"
                    variant="primary"
                  >
                    {REASON_LABEL[report.reason]}
                  </Chip>
                  <Chip
                    className="capitalize"
                    color="accent"
                    size="sm"
                    variant="soft"
                  >
                    {category?.name ?? 'Sin categoría'}
                  </Chip>
                  <span className="text-default-500">
                    {formatDate(report.createdAt)}
                  </span>
                </div>
                {listing ? (
                  <NextLink
                    className="text-foreground hover:text-primary text-base font-semibold"
                    href={routes.marketplaceItem(listing.id)}
                  >
                    {listing.title}
                  </NextLink>
                ) : (
                  <p className="text-default-500 text-sm">
                    Publicación eliminada
                  </p>
                )}
                <p className="text-default-700 mt-2 text-sm">{report.detail}</p>
                <p className="text-default-500 mt-2 text-xs">
                  Reportado por{' '}
                  {(() => {
                    const reporter = memberById.get(report.reporterId);
                    return reporter
                      ? `${reporter.fullName} ${reporter.lastInitial}.`
                      : 'un socio';
                  })()}
                </p>
              </div>
              <div className="flex flex-row gap-2 sm:flex-col sm:items-end">
                {listing && (
                  <Button
                    className="font-semibold"

                    size="sm"
                    variant="primary"
                    onPress={() =>
                      currentMember &&
                      resolve(
                        report.id,
                        currentMember.id,
                        'hide-listing',
                        'Oculta por reporte válido',
                      )
                    }
                  >
                    Ocultar publicación
                  </Button>
                )}
                <Button
                  className="font-semibold"
                  size="sm"
                  variant="outline"
                  onPress={() =>
                    currentMember &&
                    resolve(
                      report.id,
                      currentMember.id,
                      'dismiss',
                      'Reporte desestimado',
                    )
                  }
                >
                  Desestimar
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
