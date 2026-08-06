'use client';

// Shell admin — header + área de contenido. Valida rol admin/mod y redirige a
// /cuenta si no. La nav bar vive en AdminNavBar (root layout).

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { useAuthStore } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';

interface AdminShellProps {
  // Título del header (eyebrow + h1).
  eyebrow: string;
  heading: string;
  description?: string;
  // CTAs alineados a la derecha del header.
  actions?: React.ReactNode;
  // Contenido principal.
  children: React.ReactNode;
}

// Shell con header (eyebrow + h1 + description) + children.
// Nav bar de admin la monta el root layout (AdminNavBar).
export function AdminShell({
  eyebrow,
  heading,
  description,
  actions,
  children,
}: AdminShellProps) {
  const member = useAuthStore((s) => s.currentMember());
  const router = useRouter();
  // Hidratación: placeholder estable hasta el mount.
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
    <Section as="section" spacing="sm">
      <Container size="xl">
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
      </Container>
    </Section>
  );
}
