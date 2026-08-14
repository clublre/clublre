import Image from 'next/image';
import { Icon } from '@iconify/react';

import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { CardClub } from '@/components/ui/CardClub';
import { title } from '@/components/primitives';
import { cn } from '@/lib/utils';

// Integrantes de Staff — foto solo si hay retrato con licencia libre
// (ver `public/fito/CREDITS.md`). Los iconos son phosphor via Iconify.
type StaffMember = {
  name: string;
  role: string;
  isLead?: boolean;
  /** Slug del archivo en `/public/fito/` (sin extensión). */
  slug?: string;
  /** Icono phosphor (`ph:...`) según el instrumento. */
  icon: string;
};
const staffBands: ReadonlyArray<StaffMember> = [
  {
    name: 'Fito Páez',
    role: 'Voz y composición',
    isLead: true,
    slug: 'fito-paez',
    icon: 'ph:microphone-fill',
  },
  {
    name: '"Pájaro" Gómez',
    role: 'Batería',
    slug: 'pajaro-gomez',
    icon: 'ph:drum-fill',
  },
  {
    name: 'Germán Risemberg',
    role: 'Bajo y composición',
    icon: 'ph:music-notes-fill',
  },
  { name: 'Carlos Murias', role: 'Guitarras', icon: 'ph:guitar-fill' },
  { name: 'Maxi Ades', role: 'Percusión', icon: 'ph:metronome-fill' },
];

type JuryMember = { name: string; role: string; slug?: string; icon: string };
const jury: ReadonlyArray<JuryMember> = [
  {
    name: 'Juan Carlos Baglietto',
    role: 'Cantautor',
    slug: 'juan-carlos-baglietto',
    icon: 'ph:microphone-fill',
  },
  {
    name: 'Rubén Goldín',
    role: 'Cantautor',
    slug: 'ruben-goldin',
    icon: 'ph:microphone-fill',
  },
  { name: 'Juan Chianelli', role: 'Cantautor', icon: 'ph:microphone-fill' },
  { name: 'Norberto Campos', role: 'Figura cultural', icon: 'ph:star-fill' },
];

/**
 * FITO Y EL ESTU — sección cinemática.
 *
 * Layout:
 * - Hero con año "1980" como marca tipográfica gigante (watermark)
 *   + título con Fito Páez en gradient sky/blue.
 * - Bloque del festival + premio como pull-quote cinemático.
 * - Integrantes de Staff: CardClub con retrato (Fito, Pájaro) y mini-cards
 *   con icono para Risemberg, Murias y Ades.
 * - Jurado: misma lógica — 2 cols de fotos + mini-cards para Chianelli y
 *   Norberto Campos.
 * - Cierre con la frase de orgullo barrial.
 *
 * Variante `gradient` del Section para atmósfera cálida. La
 * iluminación ambiental la maneja el `AmbientBlobs` del page-level
 * (en `app/about/page.tsx`) para que el glow fluya entre secciones
 * sin bordes duros.
 */
export function FitoSection() {
  return (
    <Section as="section" spacing="md">
      <Container className="relative">
        {/* ─── Hero ──────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Watermark "1980" — absoluto, atrás del contenido */}
          <span
            aria-hidden="true"
            className="text-foreground/5 pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14rem] font-bold tracking-tighter select-none md:text-[18rem]"
          >
            1980
          </span>

          <div className="relative mx-auto max-w-4xl text-center">
            <Reveal>
              <Eyebrow className="mb-4 block" tone="sky">
                10 de agosto de 1980
              </Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h2
                className={title({
                  size: 'lg',
                  class: 'mx-auto block max-w-4xl leading-[1.05]',
                })}
              >
                Fito Páez y la noche
                <br />
                <span className={title({ color: 'sky', size: 'lg' })}>
                  histórica en el Estu
                </span>
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-default-600 mx-auto mt-6 max-w-2xl text-lg">
                El{' '}
                <strong className="text-foreground font-semibold">
                  Festival de Música Progresiva
                </strong>{' '}
                que mapeó el rock rosarino. Once bandas locales compitieron; un
                jovencísimo Fito Páez, al frente de Staff, se consagró ganador.
              </p>
            </Reveal>
          </div>
        </div>

        {/* ─── Premio como pull-quote ───────────────────────────────── */}
        <Reveal delay={240}>
          <div className="mx-auto mt-14 max-w-xl">
            <CardClub className="border-sky-500/30 text-center">
              <Eyebrow className="mb-4 block" tone="sky">
                El premio
              </Eyebrow>
              {/* Wrapper en <div> en lugar de <CardClubBody> — este último
                  ya renderiza un <p>, y anidar <p> adentro dispara
                  hydration error de React. */}
              <div className="text-default-600 text-sm leading-relaxed">
                <p className="text-default-700 text-xl leading-relaxed font-semibold md:text-2xl">
                  &ldquo;Una botella de whisky y dos horas de grabación en un
                  estudio de calle Dorrego al 700&rdquo;
                </p>
                <p className="mt-4">Tan auténtico como inolvidable.</p>
              </div>
            </CardClub>
          </div>
        </Reveal>

        {/* ─── Staff — los que compartieron escenario ──────────────── */}
        <Reveal delay={320}>
          <div className="mt-16">
            <SectionHeader
              align="center"
              description="Los cinco músicos que acompañaron a Fito en Staff aquella noche."
              eyebrow="Staff en escena"
              heading="La banda"
              tone="sky"
              width="md"
            />

            {/* Lineup — grid responsivo: 2/3/5 según viewport. */}
            <div className="mx-auto max-w-4xl">
              {/* Photo cards — imagen como bg con filtro sky + overlay
                  degradado y texto blanco al fondo (look editorial). */}
              <div className="grid items-stretch gap-4 sm:grid-cols-2">
                {staffBands
                  .filter((m) => m.slug)
                  .map((member, i) => (
                    <Reveal
                      key={member.name}
                      className="h-full"
                      delay={i * 100}
                    >
                      <article
                        className={cn(
                          'group shadow-club relative aspect-[4/5] overflow-hidden rounded-2xl',
                          'hover:shadow-club-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1',
                          member.isLead && 'ring-primary ring-2',
                        )}
                      >
                        {/* Imagen de fondo */}
                        <Image
                          fill
                          alt={`Retrato de ${member.name}`}
                          className="absolute inset-0 h-full w-full object-cover object-top grayscale transition-all duration-500 group-hover:grayscale-0"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          src={`/fito/${member.slug}.jpg`}
                        />
                        {/* Filtro sky duotone (mix-blend-multiply sobre la
                            imagen en grayscale; opacity-0 al hover). */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-sky-500/45 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0"
                        />
                        {/* Degradado inferior para contraste del texto */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent"
                        />
                        {/* Texto overlay */}
                        <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                          <h3 className="text-xl font-semibold tracking-tight text-white drop-shadow-sm">
                            {member.name}
                          </h3>
                          <p className="mt-2 flex items-center gap-1.5 text-xs tracking-[0.18em] text-white/85 uppercase">
                            <Icon
                              aria-hidden="true"
                              className="size-3.5 shrink-0"
                              icon={member.icon}
                            />
                            {member.role}
                          </p>
                        </div>
                      </article>
                    </Reveal>
                  ))}
              </div>

              {/* Mini-cards estilo User — icono a la izquierda, título +
                  subtítulo a la derecha (compactas, padding p-4). */}
              {staffBands.filter((m) => !m.slug).length > 0 && (
                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {staffBands
                    .filter((m) => !m.slug)
                    .map((member, i) => (
                      <Reveal key={member.name} delay={i * 80}>
                        <article className="group bg-surface shadow-club border-default-200/0 hover:shadow-club-lg flex items-center gap-4 rounded-xl border p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5">
                          <div
                            aria-hidden="true"
                            className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full"
                          >
                            <Icon
                              className="text-primary size-6"
                              icon={member.icon}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground truncate text-sm font-semibold">
                              {member.name}
                            </p>
                            <p className="text-default-500 mt-0.5 text-[10px] tracking-[0.18em] uppercase">
                              {member.role}
                            </p>
                          </div>
                        </article>
                      </Reveal>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* ─── Jurado estelar ──────────────────────────────────────── */}
        <Reveal delay={400}>
          <div className="mt-16">
            <SectionHeader
              align="center"
              description="Grandes figuras de la cultura rosarina que quedaron impactadas por el talento precoz de Fito."
              eyebrow="El jurado"
              heading="De leyenda"
              tone="sky"
              width="md"
            />

            <div className="mx-auto max-w-4xl">
              {/* Photo cards — mismo diseño editorial que Staff. */}
              <div className="grid items-stretch gap-4 sm:grid-cols-2">
                {jury
                  .filter((m) => m.slug)
                  .map((member, i) => (
                    <Reveal
                      key={member.name}
                      className="h-full"
                      delay={i * 100}
                    >
                      <article
                        className={cn(
                          'group shadow-club relative aspect-[4/5] overflow-hidden rounded-2xl',
                          'hover:shadow-club-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1',
                        )}
                      >
                        <Image
                          fill
                          alt={`Retrato de ${member.name}`}
                          className="absolute inset-0 h-full w-full object-cover object-top grayscale transition-all duration-500 group-hover:grayscale-0"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          src={`/fito/${member.slug}.jpg`}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-sky-500/45 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent"
                        />
                        <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                          <h3 className="text-xl font-semibold tracking-tight text-white drop-shadow-sm">
                            {member.name}
                          </h3>
                          <p className="mt-2 flex items-center gap-1.5 text-xs tracking-[0.18em] text-white/85 uppercase">
                            <Icon
                              aria-hidden="true"
                              className="size-3.5 shrink-0"
                              icon={member.icon}
                            />
                            {member.role}
                          </p>
                        </div>
                      </article>
                    </Reveal>
                  ))}
              </div>

              {/* Mini-cards estilo User — mismo patrón que Staff. */}
              {jury.filter((m) => !m.slug).length > 0 && (
                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {jury
                    .filter((m) => !m.slug)
                    .map((member, i) => (
                      <Reveal key={member.name} delay={i * 80}>
                        <article className="group bg-surface shadow-club border-default-200/0 hover:shadow-club-lg flex items-center gap-4 rounded-xl border p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5">
                          <div
                            aria-hidden="true"
                            className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full"
                          >
                            <Icon
                              className="text-primary size-6"
                              icon={member.icon}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground truncate text-sm font-semibold">
                              {member.name}
                            </p>
                            <p className="text-default-500 mt-0.5 text-[10px] tracking-[0.18em] uppercase">
                              {member.role}
                            </p>
                          </div>
                        </article>
                      </Reveal>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* ─── Cierre ──────────────────────────────────────────────── */}
        <Reveal delay={480}>
          <p className="text-default-600 mx-auto mt-16 max-w-2xl text-center text-base italic md:text-lg">
            Aquella velada en nuestro club fue una de las chispas iniciales que
            terminarían dando origen a la mítica{' '}
            <span className="text-foreground font-semibold">
              Trova Rosarina
            </span>
            .
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
