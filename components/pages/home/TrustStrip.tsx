import type { IconType } from 'react-icons';
import { FaMapMarkerAlt, FaShieldAlt, FaUsers } from 'react-icons/fa';

import { Section, Container } from '@/components/ui';

/** Trust strip — quick social proof between hero and activities.
 *  Single source of truth so the strip renders consistently and
 *  copy changes are local to this file. */
const STATS: ReadonlyArray<{
  icon: IconType;
  value: string;
  label: string;
}> = [
  {
    icon: FaUsers,
    value: '3.500+',
    label: 'Socios activos',
  },
  {
    icon: FaShieldAlt,
    value: '1959',
    label: 'Año de fundación',
  },
  {
    icon: FaMapMarkerAlt,
    value: 'Iriondo 375',
    label: 'Rosario, Santa Fe',
  },
] as const;

/**
 * TrustStrip — three stats in a single card, sits between the
 * hero and the activities list. Plain div (not CardClub) because
 * CardClub wraps children in a padded div, which breaks the
 * internal grid of hairlines between the three cells.
 */
export function TrustStrip() {
  return (
    <Section as="section" spacing="md">
      <Container size="sm">
        <div className="bg-surface shadow-club grid gap-6 overflow-hidden rounded-xl sm:grid-cols-3 sm:gap-px">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 px-6 py-2 text-center sm:py-6"
            >
              <span className="bg-primary/10 text-primary inline-flex size-12 shrink-0 items-center justify-center rounded-xl">
                <stat.icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  {stat.value}
                </p>
                <p className="text-default-600 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
