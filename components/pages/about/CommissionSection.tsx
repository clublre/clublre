import { Section, Container, SectionHeader, Eyebrow } from '@/components/ui';
import { commission } from '@/data/club';

/**
 * CommissionSection — board of directors grid.
 *
 * Server component. Reads `commission` from `data/club.ts` so the
 * roster can be edited in one place. `id="comision"` on the section
 * anchors the "#comision" hash link used by the pricing tier CTAs.
 */
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
