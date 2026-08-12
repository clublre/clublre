import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { CardClub } from '@/components/ui/CardClub';
import { title } from '@/components/primitives';

// Integrantes de Staff — la banda que lideró Fito Páez aquella noche.
// Lo mostramos como un marquee horizontal para evocar el "lineup" de
// un festival. Cada nombre con su rol en minúscula.
const staffBands: ReadonlyArray<{ name: string; role: string }> = [
  { name: 'Fito Páez', role: 'Voz y composición' },
  { name: 'Germán Risemberg', role: 'bajo y composición' },
  { name: 'Carlos Murias', role: 'guitarras' },
  { name: '"Pájaro" Gómez', role: 'batería' },
  { name: 'Maxi Ades', role: 'percusión' },
];

const jury: ReadonlyArray<string> = [
  'Juan Carlos Baglietto',
  'Rubén Goldín',
  'Juan Chianelli',
  'Norberto Campos',
];

/**
 * FITO Y EL ESTU — sección cinemática.
 *
 * Layout:
 * - Hero con año "1980" como marca tipográfica gigante (watermark)
 *   + título con Fito Páez en gradient sky/blue.
 * - Bloque del festival + premio como pull-quote cinemático.
 * - Integrantes de Staff en cluster de chips.
 * - Jurado como 4 cards (auto-fit).
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

            <div className="flex flex-wrap justify-center gap-3">
              {staffBands.map((member, i) => (
                <Reveal key={member.name} delay={i * 80}>
                  <div className="bg-surface border-default-200/10 rounded-full border px-5 py-2.5 shadow transition-colors hover:border-sky-500/20 hover:bg-sky-500/5">
                    <span className="text-foreground font-semibold">
                      {member.name}
                    </span>
                    <span className="text-default-500 ml-2 text-xs tracking-wider uppercase">
                      {member.role}
                    </span>
                  </div>
                </Reveal>
              ))}
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

            <div className="grid-auto-fit-220 grid gap-4">
              {jury.map((name) => (
                <div
                  key={name}
                  className="bg-surface border-default-200/10 rounded-xl border p-5 text-center shadow"
                >
                  <p className="text-foreground font-semibold">{name}</p>
                </div>
              ))}
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
