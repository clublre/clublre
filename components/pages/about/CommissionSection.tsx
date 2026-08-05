import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { CommissionGrid } from './CommissionGrid';

/** Sección de comisión directiva. Renderiza un grid moderno de
 *  cards: Presidente destacada, nivel 1 en row, nivel 2 (vocales)
 *  agrupados. `id="comision"` ancla el link `#comision` que usan los
 *  CTAs de los planes. */
export function CommissionSection() {
  return (
    <Section as="section" id="comision" spacing="lg">
      <Container>
        <SectionHeader
          description="Una comisión elegida por los socios, comprometida con la transparencia y el crecimiento del club."
          eyebrow="Comisión directiva"
          heading="Quienes conducen el club"
        />

        <Reveal>
          <CommissionGrid />
        </Reveal>
      </Container>
    </Section>
  );
}
