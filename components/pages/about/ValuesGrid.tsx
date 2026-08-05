import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui/CardClub';

/** Grid de 3 cards con los valores centrales del club. El copy
 *  editorial vive directo acá (cambia poco); se movería a `data/`
 *  cuando el sitio gane un CMS. */
export function ValuesGrid() {
  return (
    <Section as="section" spacing="lg">
      <Container>
        <SectionHeader
          description="Comunidad, formación y tradición se construyen cada día en cada actividad, cada clase y cada partido."
          eyebrow="Nuestros valores"
          heading="Lo que nos define"
        />

        {/* Layout asimétrico — primera card destacada (2 cols × 2 rows),
            las otras dos comparten la columna derecha. Anti-pattern
            explícito per taste-skill §6 ("three equal card columns"). */}
        <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
          <CardClub className="md:col-span-2 md:row-span-2">
            <CardClubTitle>Comunidad</CardClubTitle>
            <CardClubBody>
              Un espacio donde las familias rosarinas crecen juntas,
              compartiendo deporte, recreación y amistad. Tres generaciones
              pasaron por nuestras instalaciones y cientos de historias
              empezaron acá.
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
