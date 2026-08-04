import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { commission } from '@/data/club';

/** Sección de comisión directiva. Lee `commission` de `data/club.ts`
 *  para que el roster sea editable en un solo lugar. `id="comision"`
 *  ancla el link `#comision` usado por los CTAs de los planes. */
export function CommissionSection() {
  return (
    <Section as="section" id="comision" spacing="lg">
      <Container>
        <SectionHeader
          description="Una comisión elegida por los socios, comprometida con la transparencia y el crecimiento del club."
          eyebrow="Comisión directiva"
          heading="Quienes conducen el club"
        />

        <ul className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {commission.map((member) => (
            <li
              key={member.role}
              className="bg-surface shadow-club rounded-lg p-5"
            >
              <Eyebrow tone="default">{member.role}</Eyebrow>
              <p className="text-foreground mt-2 text-lg font-semibold">
                {member.name}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
