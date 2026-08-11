import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { commissionMeta } from '@/data/club';
import { CommissionGrid } from './CommissionGrid';

// Sección de comisión directiva — grid moderno de cards.
//  cards: Presidente destacada, nivel 1 en row, nivel 2 (vocales)
//  agrupados. `id="comision"` ancla el link `#comision` que usan los
//  CTAs de los planes. */
export function CommissionSection() {
  // Formateo localizado de la fecha de aprobación (e.g. "3 de junio de 2025").
  // El sufijo `T00:00:00` (sin `Z`) fuerza parseo local — sin él, ISO
  // `YYYY-MM-DD` se interpreta como UTC midnight y al renderizar en
  // UTC-3 (Argentina) el día retrocede a la jornada anterior.
  const approvedAtFormatted = new Date(
    `${commissionMeta.approvedAt}T00:00:00`,
  ).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Section as="section" id="comision" spacing="md">
      <Container>
        <SectionHeader
          description="Una comisión elegida por los socios, comprometida con la transparencia y el crecimiento del club."
          eyebrow="Comisión directiva"
          heading="Quienes conducen el club"
        />

        <Reveal>
          <CommissionGrid />
        </Reveal>

        <p className="text-foreground/60 mt-10 text-center text-sm leading-relaxed">
          Aprobada por {commissionMeta.assemblyType}, ACTA Nro.{' '}
          {commissionMeta.actaNumber}, el {approvedAtFormatted}. Vigencia de
          autoridad: {commissionMeta.tenureYears} años.
        </p>
      </Container>
    </Section>
  );
}
