import type { Metadata } from 'next';
import NextLink from 'next/link';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { ApplicationForm } from '@/components/pages/auth/ApplicationForm';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Solicitar alta de socio',
  description:
    'Enviá tu solicitud de alta para acceder al marketplace interno del club.',
  robots: { index: false, follow: false },
};

export default function RegistroPage() {
  return (
    <Section as="section" spacing="lg">
      <Container className="flex flex-col items-center" size="sm">
        <Eyebrow className="mb-3 block" tone="sky">
          Nuevo socio
        </Eyebrow>
        <h1
          className={title({
            size: 'md',
            class: 'mb-2 block text-center leading-[1.1]',
          })}
          style={{ viewTransitionName: 'page-title' }}
        >
          Solicitá tu alta
        </h1>
        <p className="text-default-600 mb-8 max-w-md text-center">
          La comisión directiva revisa cada solicitud contra el padrón de
          socios. Te avisamos por email cuando esté aprobada (1–3 días hábiles).
        </p>

        <div className="bg-surface shadow-club w-full rounded-2xl p-6 sm:p-8">
          <ApplicationForm />
        </div>

        <p className="text-default-500 mt-6 text-center text-sm">
          ¿Ya tenés cuenta?{' '}
          <NextLink
            className="text-primary hover:text-primary/80 font-medium"
            href={routes.login}
          >
            Iniciar sesión
          </NextLink>
        </p>
      </Container>
    </Section>
  );
}
