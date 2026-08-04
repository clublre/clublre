import type { Metadata } from 'next';
import NextLink from 'next/link';
import { Button } from '@heroui/react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { title } from '@/components/primitives';
import { LoginForm } from '@/components/pages/auth/LoginForm';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Ingresar',
  description:
    'Iniciá sesión en el marketplace interno del Club Los Rosarinos Estudiantil.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Section as="section" spacing="lg">
      <Container className="flex flex-col items-center" size="sm">
        <Eyebrow className="mb-3 block" tone="sky">
          Acceso de socios
        </Eyebrow>
        <h1
          className={title({
            size: 'md',
            class: 'mb-2 block text-center leading-[1.1]',
          })}
          style={{ viewTransitionName: 'page-title' }}
        >
          Ingresá a Entre Socios
        </h1>
        <p className="text-default-600 mb-8 max-w-md text-center">
          El marketplace interno es exclusivo para socios aprobados por la
          comisión directiva.
        </p>

        <div className="bg-surface shadow-club w-full rounded-2xl p-6 sm:p-8">
          <LoginForm />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <p className="text-default-600">¿Todavía no sos socio?</p>
          <NextLink
            className="text-primary hover:text-primary/80 font-medium"
            href={routes.registro}
          >
            <Button className="font-semibold" size="md" variant="outline">
              Enviar solicitud de alta
            </Button>
          </NextLink>
        </div>
      </Container>
    </Section>
  );
}