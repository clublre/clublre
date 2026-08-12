import type { FC } from 'react';
import { Calendar, MapPin, Users } from '@/components/ui/Icons';

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { AnimatedNumber } from '@/components/molecules/AnimatedNumber';

// Trust strip — social proof rápido entre hero y actividades.
//  Single source of truth para que el strip se vea consistente y
//  los cambios de copy sean locales a este archivo. */
const STATS: ReadonlyArray<{
  icon: FC<{ className?: string }>;
  /** Si `numeric` está definido, el count será animado al entrar en view. */
  numeric?: { value: number; suffix?: string };
  /** Texto estático (direcciones, etc.) — se muestra tal cual. */
  value?: string;
  label: string;
}> = [
  {
    icon: Users,
    numeric: { value: 900, suffix: '+' },
    label: 'Socios activos',
  },
  {
    icon: Calendar,
    numeric: { value: 1959 },
    label: 'Año de fundación',
  },
  {
    icon: MapPin,
    value: 'Iriondo 375',
    label: 'Rosario, Santa Fe',
  },
] as const;

// Tres stats en una sola card, entre hero y actividades. Plain div
//  (no CardClub) porque CardClub envuelve hijos en un div padded,
//  lo que rompe el grid interno con hairlines entre celdas. */
export function TrustStrip() {
  return (
    <Section as="section" spacing="md">
      <Container size="sm">
        <Reveal>
          <div className="bg-surface shadow-club grid gap-3 overflow-hidden rounded-xl p-3 sm:grid-cols-3 sm:gap-px sm:p-0">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="group flex items-center gap-3 px-3 py-2 text-left sm:flex-col sm:items-center sm:gap-2 sm:px-6 sm:py-6 sm:text-center"
              >
                <span className="bg-primary/10 text-primary inline-flex size-20 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
                  <stat.icon
                    aria-hidden="true"
                    className="size-10 transition-transform group-hover:scale-110"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-foreground text-3xl font-bold sm:text-2xl">
                    {stat.numeric ? (
                      <AnimatedNumber
                        duration={1.6}
                        suffix={stat.numeric.suffix}
                        value={stat.numeric.value}
                      />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-default-600 sm:text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
