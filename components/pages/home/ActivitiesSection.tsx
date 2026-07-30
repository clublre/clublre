import type { IconType } from 'react-icons';
import {
  FaBasketballBall,
  FaFistRaised,
  FaRunning,
  FaShieldAlt,
  FaSwimmer,
  FaTableTennis,
  FaVolleyballBall,
} from 'react-icons/fa';

import {
  Section,
  Container,
  SectionHeader,
  CardClub,
  CardClubHeader,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui';
import { activities } from '@/data/club';

/** Per-activity icon. Single source of truth so cards stay
 *  visually consistent (proper FA6 weight, no emojis). */
const ACTIVITY_ICONS: Record<string, { icon: IconType }> = {
  basquet: { icon: FaBasketballBall },
  natacion: { icon: FaSwimmer },
  gimnasia: { icon: FaFistRaised },
  voley: { icon: FaVolleyballBall },
  'tenis-de-mesa': { icon: FaTableTennis },
  karate: { icon: FaShieldAlt },
};

/**
 * ActivitiesSection — full list of activities offered by the
 * club. Renders a SectionHeader (eyebrow + heading + description)
 * followed by a 3-col grid of CardClubs with the activity's icon,
 * name and description.
 */
export function ActivitiesSection() {
  return (
    <Section as="section" id="actividades" spacing="lg">
      <Container>
        <SectionHeader
          description="Desde básquet federado y natación hasta karate, vóley y escuelas de iniciación deportiva."
          eyebrow="Nuestras disciplinas"
          heading="Actividades para todas las edades"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            const meta = ACTIVITY_ICONS[activity.id] ?? { icon: FaRunning };
            const Icon = meta.icon;
            return (
              <CardClub key={activity.id} className="flex flex-col">
                <CardClubHeader>
                  <span
                    aria-hidden="true"
                    className="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-lg"
                  >
                    <Icon className="size-5" />
                  </span>
                  <CardClubTitle>{activity.name}</CardClubTitle>
                </CardClubHeader>
                <CardClubBody className="grow">
                  {activity.description}
                </CardClubBody>
              </CardClub>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
