'use client';

// Nav bar del panel admin — vive en root layout, en la posición del antiguo
// Breadcrumb. Sticky top-16 (bajo la navbar global) y full-width.
// Renderiza solo si user es admin/mod y la ruta empieza con /admin.
// En cualquier otro caso null (sin layout shift).

import NextLink from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { Button } from '@heroui/react';

import { useAuthStore } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface NavItem {
  href: Route;
  label: string;
}

const NAV: ReadonlyArray<NavItem> = [
  { href: routes.admin, label: 'Dashboard' },
  { href: routes.adminUsers, label: 'Socios' },
  { href: routes.adminMarketplace, label: 'Publicaciones' },
  { href: routes.adminReports, label: 'Reportes' },
  { href: routes.adminCategories, label: 'Categorías' },
  { href: routes.adminAudit, label: 'Auditoría' },
];

export function AdminNavBar() {
  const member = useAuthStore((s) => s.currentMember());
  const pathname = usePathname();
  const mounted = useHasMounted();

  if (!mounted) return null;
  if (!member) return null;
  if (member.role !== 'admin' && member.role !== 'moderator') return null;
  if (!pathname.startsWith('/admin')) return null;

  return (
    <nav
      aria-label="Panel de administración"
      className="bg-surface/90 supports-backdrop-filter:bg-surface/70 sticky top-16 z-20 flex flex-wrap items-center gap-1 px-6 py-2 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-1">
        {NAV.map((item) => {
          const current =
            pathname === item.href ||
            (item.href !== routes.admin && pathname.startsWith(item.href));
          return (
            <NextLink
              key={item.href}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                current
                  ? 'bg-primary/10 text-primary'
                  : 'text-default-700 hover:bg-foreground/10 hover:text-foreground',
              )}
              href={item.href}
            >
              {item.label}
            </NextLink>
          );
        })}
        <NextLink className="ml-auto" href={routes.account}>
          <Button className="font-semibold" size="sm" variant="ghost">
            Volver a mi cuenta
          </Button>
        </NextLink>
      </div>
    </nav>
  );
}
