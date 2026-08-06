import type { FC } from 'react';

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import {
  CardClub,
  CardClubHeader,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui/CardClub';
import {
  BasketballIcon,
  VolleyballIcon,
  PingPongIcon,
  SwimmingIcon,
  HandFistIcon,
  MedalIcon,
} from '@/components/ui/Icons';
import { activities } from '@/data/club';

// Ícono por actividad (phosphor vía iconify). Single source of truth
 //  para mantener consistencia visual y tener el catálogo completo
 //  de deportes que lucide no cubre. */
type IconComponent = FC<{ className?: string; 'aria-hidden'?: boolean }>;

const ACTIVITY_ICONS: Record<string, { icon: IconComponent }> = {
  basquet: { icon: BasketballIcon },
  natacion: { icon: SwimmingIcon },
  gimnasia: { icon: MedalIcon },
  voley: { icon: VolleyballIcon },
  'tenis-de-mesa': { icon: PingPongIcon },
  karate: { icon: HandFistIcon },
};

// Sección con la lista completa de actividades del club.
 //  SectionHeader + grid de 3 columnas con CardClub por actividad. */
export function ActivitiesSection() {
  return (
    <Section as="section" id="actividades" spacing="lg">
      <Container>
        <SectionHeader
          description="Desde básquet federado y natación hasta karate, vóley y escuelas de iniciación deportiva."
          eyebrow="Nuestras disciplinas"
          heading="Actividades para todas las edades"
        />

        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, i) => {
            const meta = ACTIVITY_ICONS[activity.id] ?? { icon: MedalIcon };
            const Icon = meta.icon;
            return (
              <Reveal key={activity.id} className="h-full" delay={i * 80}>
                <CardClub className="group flex h-full flex-col">
                  <CardClubHeader>
                    <span
                      aria-hidden="true"
                      className="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110 group-hover:rotate-3"
                    >
                      <Icon className="size-5" />
                    </span>
                    <CardClubTitle>{activity.name}</CardClubTitle>
                  </CardClubHeader>
                  <CardClubBody className="grow">
                    {activity.description}
                  </CardClubBody>
                </CardClub>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
