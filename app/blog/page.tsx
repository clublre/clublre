import NextLink from "next/link";

import {
  Section,
  Container,
  Eyebrow,
  CardClub,
  CardClubTitle,
  CardClubBody,
} from "@/components/ui";
import { title } from "@/components/primitives";

/**
 * Posts placeholder — en producción vendrían de un CMS (Sanity, Contentful,
 * markdown files, etc.). Mantenemos el shape estable.
 */
const posts = [
  {
    slug: "apertura-pileta-2026",
    title: "Apertura de la pileta 2026",
    excerpt:
      "Volvemos a abrir las puertas de la pileta climatizada. Conocé horarios, valores y novedades para esta temporada.",
    date: "2026-01-15",
    category: "Institucional",
    accent: "sky" as const,
  },
  {
    slug: "torneo-interno-futbol",
    title: "Torneo interno de fútbol",
    excerpt:
      "Se viene una nueva edición del clásico torneo interno. Inscripciones abiertas para todas las categorías.",
    date: "2026-02-02",
    category: "Fútbol",
    accent: "amarillo" as const,
  },
  {
    slug: "escuela-basquet-juvenil",
    title: "Escuela de básquet juvenil",
    excerpt:
      "Abrimos inscripciones para la escuela de básquet infantil. Entrenamientos martes y jueves.",
    date: "2026-02-20",
    category: "Básquet",
    accent: "sky" as const,
  },
  {
    slug: "colonia-de-verano",
    title: "Colonia de verano 2026",
    excerpt:
      "Un verano distinto para los más chicos: deportes, pileta, talleres y excursiones en un solo lugar.",
    date: "2025-12-01",
    category: "Eventos",
    accent: "gradient" as const,
  },
  {
    slug: "hockey-primera",
    title: "Hockey primera: nuevo plantel",
    excerpt:
      "Conocé a las jugadoras que representarán al club en la próxima temporada de hockey sobre césped.",
    date: "2026-03-05",
    category: "Hockey",
    accent: "amarillo" as const,
  },
  {
    slug: "mejoras-instalaciones",
    title: "Mejoras en las instalaciones",
    excerpt:
      "Repavimentación de canchas, nuevos vestuarios y renovación del salón principal. Conocé el plan de obras.",
    date: "2026-03-18",
    category: "Institucional",
    accent: "gradient" as const,
  },
] as const;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));

export default function BlogPage() {
  return (
    <>
      <Section as='section' spacing='md'>
        <Container>
          <Eyebrow className='mb-3 block' tone='sky'>
            Novedades
          </Eyebrow>
          <h1
            className={title({
              size: "lg",
              class: "block max-w-3xl leading-[1.1]",
            })}>
            Blog del
            <span className={title({ color: "sky" })}>club</span>
          </h1>
          <p className='mt-4 max-w-2xl text-default-600'>
            Novedades institucionales, resultados deportivos y todo lo que pasa
            en el club.
          </p>
        </Container>
      </Section>

      <Section as='section' spacing='lg' variant='muted'>
        <Container>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {posts.map((post) => (
              <CardClub
                key={post.slug}
                accent={post.accent}
                className='flex flex-col'>
                <div className='mb-3 flex items-center justify-between text-xs'>
                  <span className='rounded-full bg-sky-50 px-2.5 py-1 font-medium uppercase tracking-wider text-sky-700 dark:bg-sky-900 dark:text-sky-200'>
                    {post.category}
                  </span>
                  <time className='text-default-500' dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
                <CardClubTitle className='hover:text-primary'>
                  <NextLink href={`/blog/${post.slug}`}>{post.title}</NextLink>
                </CardClubTitle>
                <CardClubBody className='mt-3 grow'>
                  {post.excerpt}
                </CardClubBody>
                <NextLink
                  className='mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline'
                  href={`/blog/${post.slug}`}>
                  Leer más →
                </NextLink>
              </CardClub>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
