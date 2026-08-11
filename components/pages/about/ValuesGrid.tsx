import { Fragment, type FC } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { GraduationCap, Trophy, Users } from '@/components/ui/Icons';
import { siteConfig } from '@/config/site';
import { cn, yearsSince } from '@/lib/utils';

// Lista editorial de valores — sin cards. Cada fila tiene un icono
// grande, título y body. Entre filas, un divider corto con gradient
// (fade en los extremos) para separar sin subrayar el renglón.
// Estilo revista de diseño (NYT op-ed, Monocle). Mantiene el tono
// institucional del club y se aleja del típico "grid de 3 cards iguales".
interface Value {
  icon: FC<{ className?: string }>;
  title: string;
  body: string;
}

const values: ReadonlyArray<Value> = [
  {
    icon: Users,
    title: 'Comunidad',
    body: 'Un espacio donde las familias rosarinas crecen juntas, compartiendo deporte, recreación y amistad. Tres generaciones pasaron por nuestras instalaciones y cientos de historias empezaron acá.',
  },
  {
    icon: GraduationCap,
    title: 'Formación',
    body: 'Escuelas deportivas federadas con entrenadores formados y seguimiento personalizado para cada edad.',
  },
  {
    icon: Trophy,
    title: 'Tradición',
    body: `Más de ${yearsSince(siteConfig.foundedYear)} años de historia formando campeones dentro y fuera de la cancha.`,
  },
] as const;

export function ValuesGrid() {
  return (
    <Section as="section" spacing="md">
      <Container size="md">
        <SectionHeader
          description="Comunidad, formación y tradición se construyen cada día en cada actividad, cada clase y cada partido."
          eyebrow="Nuestros valores"
          heading="Lo que nos define"
        />

        {/* Filas + dividers cortos con fade. El divider se renderiza entre
            filas (no al principio ni al final) y mide 1px de alto con un
            gradient de transparente → default-300/40 → transparente,
            180px centrado. Separa sin subrayar. El icono en sky-500/70
            es el único acento de color. */}
        <div className="mt-4 md:mt-12">
          {values.map((value, i) => (
            <Fragment key={value.title}>
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="via-default-300/40 mx-auto h-px max-w-45 bg-linear-to-r from-transparent to-transparent"
                />
              )}
              <Reveal delay={i * 100}>
                <article
                  className={cn(
                    'grid gap-5 py-10 text-center md:grid-cols-[4.5rem_1fr] md:items-center md:gap-10 md:py-14 md:text-left',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center text-sky-500/70"
                  >
                    <value.icon className="size-12 md:size-14" />
                  </span>
                  <div>
                    <h3 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
                      {value.title}
                    </h3>
                    <p className="text-default-600 mt-3 text-base leading-relaxed md:mt-4 md:text-lg">
                      {value.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            </Fragment>
          ))}
        </div>
      </Container>
    </Section>
  );
}
