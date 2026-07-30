import {
  Section,
  Container,
  Eyebrow,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui';
import { title } from '@/components/primitives';
import { commission } from '@/data/club';

export default function AboutPage() {
  return (
    <>
      {/* Header — matches the home centred pattern. */}
      <Section as="section" spacing="md">
        <Container className="text-center">
          <Eyebrow className="mb-3 block" tone="sky">
            Sobre nosotros
          </Eyebrow>
          <h1
            className={title({
              size: 'lg',
              class: 'mx-auto block max-w-3xl leading-[1.1]',
            })}
            style={{ viewTransitionName: 'page-title' }}
          >
            Una historia ligada a
            <br />
            <span className={title({ color: 'sky' })}>Rosario</span>
          </h1>
          <p className="text-default-600 mx-auto mt-6 max-w-2xl text-lg">
            Fundado en 1943, el Club Los Rosarinos Estudiantil es una
            institución deportiva y social con más de 3.500 socios. A lo largo
            de ocho décadas, hemos sido parte de la vida de miles de familias
            rosarinas, formando deportistas y generando comunidad.
          </p>
        </Container>
      </Section>

      {/* Valores */}
      <Section as="section" spacing="lg">
        <Container>
          <div className="mb-12 text-center">
            <Eyebrow className="mb-3 block" tone="amarillo">
              Nuestros valores
            </Eyebrow>
            <h2 className={title({ size: 'md', class: 'block' })}>
              Lo que nos define
            </h2>
            <p className="text-default-600 mx-auto mt-3 max-w-xl">
              Comunidad, formación y tradición se construyen cada día en cada
              actividad, cada clase y cada partido.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <CardClub accent="sky">
              <CardClubTitle>Comunidad</CardClubTitle>
              <CardClubBody>
                Un espacio donde las familias rosarinas crecen juntas,
                compartiendo deporte, recreación y amistad.
              </CardClubBody>
            </CardClub>
            <CardClub accent="amarillo">
              <CardClubTitle>Formación</CardClubTitle>
              <CardClubBody>
                Escuelas deportivas federadas con entrenadores formados y
                seguimiento personalizado para cada edad.
              </CardClubBody>
            </CardClub>
            <CardClub accent="gradient">
              <CardClubTitle>Tradición</CardClubTitle>
              <CardClubBody>
                Más de 80 años de historia formando campeones dentro y fuera de
                la cancha.
              </CardClubBody>
            </CardClub>
          </div>
        </Container>
      </Section>

      {/* Comisión */}
      <Section as="section" id="contacto" spacing="lg">
        <Container>
          <div className="mb-12 text-center">
            <Eyebrow className="mb-3 block" tone="sky">
              Comisión directiva
            </Eyebrow>
            <h2 className={title({ size: 'md', class: 'block' })}>
              Quienes conducen el club
            </h2>
            <p className="text-default-600 mx-auto mt-3 max-w-xl">
              Una comisión elegida por los socios, comprometida con la
              transparencia y el crecimiento del club.
            </p>
          </div>

          <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {commission.map((member) => (
              <li
                key={member.role}
                className="bg-surface shadow-club rounded-lg p-5"
              >
                <p className="text-default-500 text-xs font-medium tracking-wider uppercase">
                  {member.role}
                </p>
                <p className="text-foreground mt-2 text-lg font-semibold">
                  {member.name}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
