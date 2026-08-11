import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import {
  CardClub,
  CardClubTitle,
  CardClubBody,
} from '@/components/ui/CardClub';
import { cn } from '@/lib/utils';

// Hechos clave de la historia del club. Estructura plana (no jerárquica)
// porque la línea temporal es lo que cuenta — la visualiación los ordena
// cronológicamente. Cuando se migre a CMS, cada `beat` se vuelve un
// registro con `date` (ISO), `title`, `body`, y opcional `image`.
interface HistoryBeat {
  year: string;
  title: string;
  body: string;
}

const beats: ReadonlyArray<HistoryBeat> = [
  {
    year: '1943',
    title: 'Dos clubes, un barrio',
    body: 'En el corazón del barrio Agote coexistían dos instituciones: el Club Los Rosarinos (en calle Iriondo 375) y el Club Estudiantil (en Crespo 348), este último con enorme tradición en bochas y básquet.',
  },
  {
    year: '1959',
    title: 'La fusión histórica',
    body: 'El 25 de enero, socios y vecinos de ambas asociaciones decidieron fusionarse y dar vida al Club Los Rosarinos Estudiantil, bajo la primera presidencia de Alfredo Beccani.',
  },
  {
    year: '1964–67',
    title: 'La pileta de natación',
    body: 'Con esfuerzo colectivo se inició la histórica pileta, inaugurada tres años después, que llegó a albergar nadadores de competencia a nivel nacional.',
  },
];

/**
 * Sección HISTORIA — corazón del barrio Agote.
 *
 * Estructura en dos actos:
 * 1. La leyenda de la moneda al aire como hero editorial — pull-quote
 *    grande con tratamiento tipográfico que evoca un documento de archivo.
 * 2. Timeline en 3 cards (auto-fit), cerrando con un featured card
 *    "El Club Hoy" que ancla la historia en el presente.
 */
export function HistorySection() {
  return (
    <>
      {/* ─── Acto 1 · La leyenda de la moneda ───────────────────── */}
      <Section as="section" spacing="md">
        <Container>
          <Reveal>
            <Eyebrow className="mb-4 block text-center" tone="sky">
              1959 · Una moneda al aire
            </Eyebrow>
          </Reveal>

          <Reveal delay={140}>
            <figure className="mx-auto max-w-4xl text-center">
              {/* Comillas decorativas enormes — el ojo entra por acá */}
              <span
                aria-hidden="true"
                className="block text-center font-serif text-8xl leading-none text-sky-500/30 md:text-9xl"
              >
                &ldquo;
              </span>

              <blockquote className="text-foreground -mt-12 text-2xl leading-snug font-medium md:text-3xl md:leading-tight lg:text-4xl">
                Cuenta la leyenda popular que a la hora de decidir el orden
                definitivo de los nombres para la nueva institución, las
                comisiones tiraron una moneda al aire…
                <span className="font-semibold"> ¡y cayó de canto</span>
                <span aria-hidden="true" className="text-sky-500/30">
                  !&rdquo;
                </span>
              </blockquote>

              <figcaption className="text-default-600 mt-6 text-base md:text-lg">
                Así nació la identidad inquebrantable de nuestro querido{' '}
                <span className="text-foreground font-semibold">LRE</span>.
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </Section>

      {/* ─── Acto 2 · Timeline + cierre ─────────────────────────── */}
      <Section as="section" spacing="md">
        <Container>
          <SectionHeader
            description="Dos clubes, una misma pasión. La historia se escribió con el esfuerzo de los vecinos del barrio Agote."
            eyebrow="Nuestra historia"
            heading="El corazón del barrio Agote"
          />

          {/* Beats cronológicos — grid fijo responsive (1/2/3 cols) en vez
              de auto-fit. Así evitamos el caso "card solo en row con
              espacio vacío a la derecha" — el último beat hace
              `sm:col-span-2` cuando solo entran 2 por fila. */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beats.map((beat, i) => (
              <Reveal
                key={beat.year}
                className={cn(
                  // Si quedaría solo en la última fila (contamos 3 beats
                  // y siempre hay un impar), ocupa 2 cols en el breakpoint
                  // de 2 cols. En lg:grid-cols-3 (3 cols) el col-span-1
                  // vuelve al ancho normal.
                  i === beats.length - 1 && 'sm:col-span-2 lg:col-span-1',
                )}
                delay={i * 100}
              >
                <CardClub className="h-full">
                  <span
                    aria-hidden="true"
                    className="text-primary text-4xl font-bold tracking-tighter md:text-5xl"
                  >
                    {beat.year}
                  </span>
                  <CardClubTitle>{beat.title}</CardClubTitle>
                  <CardClubBody>{beat.body}</CardClubBody>
                </CardClub>
              </Reveal>
            ))}
          </div>

          {/* El Club Hoy — mismo estilo que los 3 beats de arriba */}
          <Reveal className="mt-10" delay={400}>
            <CardClub className="h-full">
              <span
                aria-hidden="true"
                className="text-primary text-4xl font-bold tracking-tighter md:text-5xl"
              >
                Hoy
              </span>
              <CardClubTitle>El Club Hoy</CardClubTitle>
              <CardClubBody>
                Mantenemos vivos los valores fundacionales de 1959: desde los
                legendarios carnavales que cortaban la calle Iriondo con fiestas
                populares multitudinarias, hasta las tardes de té canasta y los
                eventos que llenan de vida a la institución. Renovamos nuestro
                compromiso con el deporte, las familias y el barrio Agote.
              </CardClubBody>
            </CardClub>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
