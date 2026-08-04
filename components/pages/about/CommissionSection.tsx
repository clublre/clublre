import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CommissionChart } from './CommissionChart';

/** Sección de comisión directiva. El organigrama es interactivo
 *  (zoom, pan, minimap) — se renderiza con `@xyflow/react` desde
 *  `CommissionChart` → `OrgChart`. `id="comision"` ancla el link
 *  `#comision` que usan los CTAs de los planes. */
export function CommissionSection() {
  return (
    <Section as="section" id="comision" spacing="lg">
      <Container>
        <SectionHeader
          description="Una comisión elegida por los socios, comprometida con la transparencia y el crecimiento del club. Usá zoom o arrastrá para navegar el organigrama."
          eyebrow="Comisión directiva"
          heading="Quienes conducen el club"
        />

        <CommissionChart />
      </Container>
    </Section>
  );
}