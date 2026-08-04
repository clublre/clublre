'use client';

// Shell del panel admin — sidebar + área de contenido. El shell
// valida que el usuario actual tenga rol admin/moderator y
// redirige a `/cuenta` si no.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Button } from '@heroui/react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { useAuthStore } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface AdminShellProps {
  /** Título del header (eyebrow + h1). */
  eyebrow: string;
  heading: string;
  description?: string;
  /** CTAs alineados a la derecha del header. */
  actions?: React.ReactNode;
  /** Contenido principal. */
  children: React.ReactNode;
}

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

/** Shell con sidebar y área de contenido. Cada ruta admin pasa
 *  su header como props. */
export function AdminShell({
  eyebrow,
  heading,
  description,
  actions,
  children,
}: AdminShellProps) {
  const member = useAuthStore((s) => s.currentMember());
  const router = useRouter();
  const pathname = usePathname();
  // Hidratación: placeholder estable hasta después del mount.
  const mounted = useHasMounted();

  useEffect(() => {
    if (!mounted) return;
    if (!member) {
      router.replace(routes.login);
      return;
    }
    if (member.role !== 'admin' && member.role !== 'moderator') {
      router.replace(routes.account);
    }
  }, [mounted, member, router]);

  if (
    !mounted ||
    !member ||
    (member.role !== 'admin' && member.role !== 'moderator')
  ) {
    return (
      <Section as="section" spacing="md">
        <Container className="text-center" size="md">
          <p className="text-default-600">Verificando permisos…</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section as="section" spacing="lg">
      <Container size="xl">
        <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
          <aside className="hidden lg:block">
            <nav
              aria-label="Panel de administración"
              className="bg-surface shadow-club sticky top-20 rounded-2xl p-3"
            >
              <ul className="flex flex-col gap-1">
                {NAV.map((item) => {
                  const current =
                    pathname === item.href ||
                    (item.href !== routes.admin &&
                      pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <NextLink
                        aria-current={current ? 'page' : undefined}
                        className={cn(
                          'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          current
                            ? 'bg-primary/10 text-primary'
                            : 'text-default-700 hover:bg-foreground/10 hover:text-foreground',
                        )}
                        href={item.href}
                      >
                        {item.label}
                      </NextLink>
                    </li>
                  );
                })}
              </ul>
              <NextLink
                className="mt-3 block font-semibold"
                href={routes.account}
              >
                <Button
                  className="w-full font-semibold"
                  size="sm"
                  variant="ghost"
                >
                  Volver a mi cuenta
                </Button>
              </NextLink>
            </nav>
          </aside>

          <div>
            <header className="mb-6">
              <Eyebrow className="mb-2 block" tone="sky">
                {eyebrow}
              </Eyebrow>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h1
                  className={title({
                    size: 'md',
                    class: 'block leading-[1.1]',
                  })}
                >
                  {heading}
                </h1>
                {actions ? <div className="flex gap-2">{actions}</div> : null}
              </div>
              {description ? (
                <p className="text-default-600 mt-2 max-w-2xl">{description}</p>
              ) : null}
            </header>
            {children}
          </div>
        </div>
      </Container>
    </Section>
  );
}
