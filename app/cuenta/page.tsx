'use client';

// Página `/cuenta` — el layout redirige si no hay sesión o si la
// cuenta está `pending` / `rejected` / `suspended`. Esta página
// asume que ya pasó el gate y muestra la información del socio.

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NextLink from 'next/link';
import { Button } from '@heroui/react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { RoleBadge, StatusBadge } from '@/components/atoms/StatusBadge';
import { MyListings } from '@/components/pages/account/MyListings';
import { useAuthStore, useCurrentMember } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';

export default function AccountPage() {
  const member = useCurrentMember();
  const signOut = useAuthStore((s) => s.signOut);
  const router = useRouter();
  // Hidratación: `mounted=false` durante SSR y primer render del
  // cliente, así renderizamos el placeholder en ambos. Después del
  // mount leemos la sesión persistida en localStorage.
  const mounted = useHasMounted();

  useEffect(() => {
    if (!mounted) return;
    if (!member) {
      router.replace(routes.login);
      return;
    }
    if (member.accountStatus === 'pending') {
      router.replace(routes.accountStatus);
    }
  }, [mounted, member, router]);

  if (!mounted || !member || member.accountStatus === 'pending') {
    return (
      <Section as="section" spacing="md">
        <Container className="text-center" size="sm">
          <p className="text-default-600">Cargando tu cuenta…</p>
        </Container>
      </Section>
    );
  }

  const yearsAsMember = Math.max(
    1,
    Math.floor(
      (Date.parse(new Date().toString()) -
        new Date(member.memberSince).getTime()) /
        (365 * 24 * 60 * 60 * 1000),
    ),
  );

  return (
    <>
      <Section as="section" spacing="md">
        <Container size="md">
          <Eyebrow className="mb-3 block" tone="sky">
            Mi cuenta
          </Eyebrow>
          <h1
            className={title({
              size: 'md',
              class: 'block leading-[1.1]',
            })}
            style={{ viewTransitionName: 'page-title' }}
          >
            Hola, {member.fullName.split(' ')[0]}
          </h1>
          <p className="text-default-600 mt-3">
            Gestioná tus publicaciones, tu perfil y tu acceso al marketplace.
          </p>
        </Container>
      </Section>

      <Section as="section" spacing="lg">
        <Container size="md">
          <div className="bg-surface shadow-club mb-10 grid gap-6 rounded-2xl p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <Eyebrow className="mb-1 block" tone="default">
                Perfil
              </Eyebrow>
              <p className="text-foreground text-xl font-semibold">
                {member.fullName}
              </p>
              <p className="text-default-600 text-sm">{member.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <RoleBadge role={member.role} />
                <StatusBadge status={member.accountStatus} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-default-500">Zona</dt>
                  <dd className="text-foreground font-medium">{member.zone}</dd>
                </div>
                <div>
                  <dt className="text-default-500">Antigüedad</dt>
                  <dd className="text-foreground font-medium">
                    {yearsAsMember} año{yearsAsMember === 1 ? '' : 's'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-default-200/60 flex flex-col gap-3 sm:border-l sm:pl-6">
              <Eyebrow className="block" tone="default">
                Acciones rápidas
              </Eyebrow>
              <NextLink className="font-semibold" href={routes.marketplaceNew}>
                <Button
                  className="w-full font-semibold"
                  size="md"
                  variant="primary"
                >
                  Publicar en Entre Socios
                </Button>
              </NextLink>
              {(member.role === 'admin' || member.role === 'moderator') && (
                <NextLink className="font-semibold" href={routes.admin}>
                  <Button
                    className="w-full font-semibold"
                    size="md"
                    variant="outline"
                  >
                    Ir al panel de administración
                  </Button>
                </NextLink>
              )}
              <Button
                className="text-default-600 hover:text-foreground w-full justify-start"
                size="md"
                variant="ghost"
                onPress={() => {
                  signOut();
                  router.push(routes.home);
                }}
              >
                Cerrar sesión
              </Button>
            </div>
          </div>

          <Eyebrow className="mb-3 block" tone="sky">
            Mis publicaciones
          </Eyebrow>
          <MyListings ownerId={member.id} />
        </Container>
      </Section>
    </>
  );
}
