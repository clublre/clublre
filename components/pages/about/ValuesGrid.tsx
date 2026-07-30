import {
  Section,
  Container,
  SectionHeader,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui';

/**
 * ValuesGrid — three-card grid showcasing the club's core values.
 *
 * Server component. Static content (Comunidad, Formación, Tradición)
 * lives directly here because it's editorial copy that changes
 * rarely and would only be extracted to data/ when the site gains
 * a CMS.
 */
export function ValuesGrid() {
  return (
    <Section as="section" spacing="lg">
      <Container>
        <SectionHeader
          description="Comunidad, formación y tradición se construyen cada día en cada actividad, cada clase y cada partido."
          eyebrow="Nuestros valores"
          heading="Lo que nos define"
        />

        <div className="grid gap-6 md:grid-cols-3">
          <CardClub>
            <CardClubTitle>Comunidad</CardClubTitle>
            <CardClubBody>
              Un espacio donde las familias rosarinas crecen juntas,
              compartiendo deporte, recreación y amistad.
            </CardClubBody>
          </CardClub>
          <CardClub>
            <CardClubTitle>Formación</CardClubTitle>
            <CardClubBody>
              Escuelas deportivas federadas con entrenadores formados y
              seguimiento personalizado para cada edad.
            </CardClubBody>
          </CardClub>
          <CardClub>
            <CardClubTitle>Tradición</CardClubTitle>
            <CardClubBody>
              Más de 80 años de historia formando campeones dentro y fuera de la
              cancha.
            </CardClubBody>
          </CardClub>
        </div>
      </Container>
    </Section>
  );
}
