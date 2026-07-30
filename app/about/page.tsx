import type { Metadata } from 'next';

import {
  Section,
  Container,
  Eyebrow,
  SectionHeader,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui';
import { title } from '@/components/primitives';
import { commission } from '@/data/club';

export const metadata: Metadata = {
  title: 'El Club — Nuestra historia',
  description:
    'Fundado en 1943, el Club Los Rosarinos Estudiantil es una institución deportiva y social con más de 3.500 socios. Conocé nuestra historia, valores y comisión directiva.',
  openGraph: {
    title: 'El Club — Club Los Rosarinos Estudiantil',
    description:
      'Más de 80 años formando comunidad en Rosario. Conocé nuestra historia, valores y comisión directiva.',
    url: '/about',
  },
};

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
          <SectionHeader
            description="Comunidad, formación y tradición se construyen cada día en cada actividad, cada clase y cada partido."
            eyebrow="Nuestros valores"
            heading="Lo que nos define"
            tone="amarillo"
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
