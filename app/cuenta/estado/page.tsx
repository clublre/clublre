'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NextLink from 'next/link';
import { Button } from '@heroui/react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { useCurrentMember } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';

const STATUS_COPY = {
  pending: {
    title: 'Tu solicitud está en revisión',
    body: 'La comisión directiva coteja los datos con el padrón de socios. Te avisamos por email en 1–3 días hábiles. Podés volver a esta pantalla cuando quieras.',
  },
  rejected: {
    title: 'Tu solicitud fue rechazada',
    body: 'La comisión directiva no aprobó tu alta. Si creés que es un error, escribinos a comision@clublre.com.ar.',
  },
  suspended: {
    title: 'Tu cuenta está suspendida',
    body: 'Por una decisión de la comisión directiva. Para reactivarla, contactanos a comision@clublre.com.ar.',
  },
} as const;

export default function AccountStatusPage() {
  const member = useCurrentMember();
  const router = useRouter();
  // Hidratación: placeholder estable durante SSR y primer render.
  const mounted = useHasMounted();

  useEffect(() => {
    if (!mounted) return;
    if (!member) {
      router.replace(routes.login);
      return;
    }
    if (member.accountStatus === 'active') {
      router.replace(routes.account);
    }
  }, [mounted, member, router]);

  if (!mounted) return null;
  if (!member || member.accountStatus === 'active') {
    return null;
  }

  const copy = STATUS_COPY[member.accountStatus];

  return (
    <Section as="section" spacing="lg">
      <Container className="flex flex-col items-center" size="sm">
        <Eyebrow className="mb-3 block" tone="sky">
          Estado de tu cuenta
        </Eyebrow>
        <h1
          className={title({
            size: 'md',
            class: 'mb-3 block text-center leading-[1.1]',
          })}
        >
          {copy.title}
        </h1>
        <p className="text-default-600 mb-8 max-w-md text-center">
          {copy.body}
        </p>

        <div className="bg-surface shadow-club w-full rounded-2xl p-6 text-sm">
          <dl className="space-y-3">
            <div>
              <dt className="text-default-500 text-xs tracking-wider uppercase">
                Nombre
              </dt>
              <dd className="text-foreground font-medium">{member.fullName}</dd>
            </div>
            <div>
              <dt className="text-default-500 text-xs tracking-wider uppercase">
                Email
              </dt>
              <dd className="text-foreground font-medium">{member.email}</dd>
            </div>
            <div>
              <dt className="text-default-500 text-xs tracking-wider uppercase">
                Zona
              </dt>
              <dd className="text-foreground font-medium">{member.zone}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <NextLink className="font-semibold" href={routes.login}>
            <Button className="font-semibold" size="md" variant="outline">
              Cerrar sesión
            </Button>
          </NextLink>
        </div>
      </Container>
    </Section>
  );
}
