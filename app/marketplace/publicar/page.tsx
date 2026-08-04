'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { ListingForm } from '@/components/pages/marketplace/ListingForm';
import { useAuthStore } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';

export default function PublishListingPage() {
  const member = useAuthStore((s) => s.currentMember());
  const router = useRouter();
  // Hidratación: durante SSR y primer render del cliente, no leemos
  // la sesión persistida en localStorage. Renderizamos siempre el
  // placeholder hasta después del mount. Así el árbol inicial es
  // idéntico en server y cliente.
  const mounted = useHasMounted();

  useEffect(() => {
    if (!mounted) return;
    if (!member) {
      router.replace(routes.login);
      return;
    }
    if (member.accountStatus !== 'active') {
      router.replace(routes.accountStatus);
    }
  }, [mounted, member, router]);

  if (!mounted || !member || member.accountStatus !== 'active') {
    return (
      <Section as="section" spacing="md">
        <Container className="text-center" size="md">
          <p className="text-default-600">
            Verificando tu acceso al marketplace…
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section as="section" spacing="lg">
      <Container className="flex flex-col" size="md">
        <Eyebrow className="mb-3 block" tone="sky">
          Nueva publicación
        </Eyebrow>
        <h1
          className={title({
            size: 'md',
            class: 'mb-2 block leading-[1.1]',
          })}
          style={{ viewTransitionName: 'page-title' }}
        >
          Publicá en Entre Socios
        </h1>
        <p className="text-default-600 mb-8">
          Tu primera publicación queda en revisión automática. Las siguientes se
          publican al instante.
        </p>

        <div className="bg-surface shadow-club rounded-2xl p-6 sm:p-8">
          <ListingForm />
        </div>
      </Container>
    </Section>
  );
}
