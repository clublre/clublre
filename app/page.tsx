import NextLink from 'next/link';
import { Button } from '@heroui/react';
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaRunning,
  FaUsers,
} from 'react-icons/fa';

import {
  Section,
  Container,
  Eyebrow,
  CardClub,
  CardClubHeader,
  CardClubTitle,
  CardClubBody,
  BlurryBlob,
} from '@/components/ui';
import { title, subtitle } from '@/components/primitives';
import { activities } from '@/data/club';
import { cn } from '@/lib/utils';

/** Trust strip — quick social proof between hero and activities. */
const STATS = [
  {
    icon: FaUsers,
    value: '3.500+',
    label: 'Socios activos',
  },
  {
    icon: FaRunning,
    value: '15+',
    label: 'Disciplinas',
  },
  {
    icon: FaMapMarkerAlt,
    value: 'Iriondo 375',
    label: 'Rosario, Santa Fe',
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Section
        as="section"
        className="relative isolate overflow-hidden"
        spacing="lg"
        variant="gradient"
      >
        <BlurryBlob />
        <Container className="animate-fade-in relative text-center">
          <Eyebrow className="mb-4 block" tone="sky">
            Club Los Rosarinos Estudiantil
          </Eyebrow>
          <h1
            className={title({
              size: 'lg',
              class: 'mx-auto block max-w-4xl leading-[1.05]',
            })}
          >
            Más de 80 años
            <br />
            <span className={title({ color: 'sky' })}>formando comunidad</span>
          </h1>
          <p
            className={subtitle({
              class: 'text-default-700 mx-auto mt-6 max-w-xl text-center',
            })}
          >
            Deportes, recreación y vida social para toda la familia en el
            corazón de Rosario.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <NextLink href="/pricing">
              <Button size="lg" variant="primary">
                Conocé las cuotas
                <FaArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Button>
            </NextLink>
            <NextLink href="/about">
              <Button size="lg" variant="outline">
                Sobre el club
              </Button>
            </NextLink>
          </div>
        </Container>
      </Section>

      {/* Trust strip — overlapping the hero/actividades seam */}
      <Section
        as="section"
        className="relative z-10 -mt-12 sm:-mt-16"
        spacing="none"
      >
        <Container size="xl">
          <div
            className={cn(
              'bg-background border-default-200 shadow-club-lg grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-3',
            )}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-background flex items-center gap-4 px-6 py-6 sm:py-8"
              >
                <span className="bg-primary/10 text-primary inline-flex size-12 shrink-0 items-center justify-center rounded-xl">
                  <stat.icon aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-default-600 truncate text-sm">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Actividades */}
      <Section as="section" id="actividades" spacing="lg" variant="muted">
        <Container>
          <div className="mb-12 text-center">
            <Eyebrow className="mb-3 block" tone="sky">
              Nuestras disciplinas
            </Eyebrow>
            <h2 className={title({ size: 'md', class: 'block' })}>
              Actividades para todas las edades
            </h2>
            <p className="text-default-600 mx-auto mt-4 max-w-2xl">
              Desde básquet federado y natación hasta karate, vóley y
              escuelas de iniciación deportiva.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <CardClub
                key={activity.id}
                accent={activity.id === 'futbol' ? 'sky' : 'amarillo'}
              >
                <CardClubHeader>
                  <span aria-hidden="true" className="text-3xl">
                    {activity.icon}
                  </span>
                  <CardClubTitle>{activity.name}</CardClubTitle>
                </CardClubHeader>
                <CardClubBody>{activity.description}</CardClubBody>
              </CardClub>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section as="section" spacing="md">
        <Container>
          <div className="from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-club-lg relative overflow-hidden rounded-3xl bg-linear-to-br p-10 text-center md:p-16">
            {/* Decorative blurred shapes */}
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 size-64 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl"
            />

            <div className="relative">
              <Eyebrow className="mb-4 block" tone="default">
                Sumate al club
              </Eyebrow>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Tres generaciones ya pasaron por acá.
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-base opacity-90 md:text-lg">
                Te invitamos a ser parte. Conocé nuestras cuotas y empezá a
                disfrutar del club hoy mismo.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NextLink href="/pricing">
                  <Button size="lg" variant="outline">
                    Quiero asociarme
                    <FaArrowRight aria-hidden="true" className="ml-2 size-4" />
                  </Button>
                </NextLink>
                <NextLink href="/about">
                  <Button
                    className="text-foreground hover:text-foreground"
                    size="lg"
                    variant="ghost"
                  >
                    Conocé nuestra historia
                  </Button>
                </NextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
