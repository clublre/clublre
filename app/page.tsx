import NextLink from "next/link";
import { Button } from "@heroui/react";

import {
  Section,
  Container,
  Eyebrow,
  CardClub,
  CardClubHeader,
  CardClubTitle,
  CardClubBody,
  BlurryBlob,
} from "@/components/ui";
import { title, subtitle } from "@/components/primitives";
import { activities } from "@/config/design-tokens";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section
        as='section'
        className='relative isolate overflow-hidden'
        spacing='lg'
        variant='gradient'>
        <BlurryBlob />
        <Container className='relative animate-fade-in text-center'>
          <Eyebrow className='mb-4 block' tone='sky'>
            Club Los Rosarinos Estudiantil
          </Eyebrow>
          <h1
            className={title({
              size: "lg",
              class: "block max-w-4xl mx-auto leading-[1.05]",
            })}>
            Más de 80 años
            <br />
            <span className={title({ color: "sky" })}>formando comunidad</span>
          </h1>
          <p
            className={subtitle({
              class: "mx-auto mt-6 max-w-xl text-center text-default-700",
            })}>
            Deportes, recreación y vida social para toda la familia en el
            corazón de Rosario.
          </p>
          <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
            <NextLink href='/pricing'>
              <Button className='font-semibold' size='lg' variant='primary'>
                Conocé las cuotas
              </Button>
            </NextLink>
            <NextLink href='/about'>
              <Button className='font-semibold' size='lg' variant='outline'>
                Sobre el club
              </Button>
            </NextLink>
          </div>
        </Container>
      </Section>

      {/* Actividades */}
      <Section as='section' id='actividades' spacing='lg' variant='muted'>
        <Container>
          <div className='mb-12 text-center'>
            <Eyebrow className='mb-3 block' tone='sky'>
              Nuestras disciplinas
            </Eyebrow>
            <h2 className={title({ size: "md", class: "block" })}>
              Actividades para todas las edades
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-default-600'>
              Desde fútbol y básquet federado hasta pileta climatizada y
              escuelas de iniciación deportiva.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {activities.map((activity) => (
              <CardClub
                key={activity.id}
                accent={activity.id === "futbol" ? "sky" : "amarillo"}>
                <CardClubHeader>
                  <span aria-hidden='true' className='text-3xl'>
                    {activity.icon}
                  </span>
                  <CardClubTitle>{activity.name}</CardClubTitle>
                </CardClubHeader>
                <CardClubBody>{activity.description}</CardClubBody>
              </CardClub>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section as='section' spacing='md'>
        <Container>
          <div className='gradient-sky rounded-2xl p-10 text-center text-sky-900 shadow-club-lg md:p-16'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              Sumate al club
            </h2>
            <p className='mx-auto mb-8 max-w-xl text-base text-sky-800 md:text-lg'>
              Tres generaciones de rosarinos pasaron por nuestras instalaciones.
              Te invitamos a ser parte.
            </p>
            <NextLink href='/pricing'>
              <Button className='font-semibold' size='lg' variant='primary'>
                Quiero asociarme
              </Button>
            </NextLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
