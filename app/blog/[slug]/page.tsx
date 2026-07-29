import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { FaArrowLeft } from "react-icons/fa";

import { Section, Container, Eyebrow } from "@/components/patterns";
import { title } from "@/components/primitives";

/**
 * Posts source-of-truth — keeps typedRoutes happy and provides static
 * params. In production these would come from a CMS.
 */
const posts = {
  "apertura-pileta-2026": {
    title: "Apertura de la pileta 2026",
    date: "2026-01-15",
    category: "Institucional",
    body: "Volvemos a abrir las puertas de la pileta climatizada. Conocé horarios, valores y novedades para esta temporada.",
  },
  "torneo-interno-futbol": {
    title: "Torneo interno de fútbol",
    date: "2026-02-02",
    category: "Fútbol",
    body: "Se viene una nueva edición del clásico torneo interno. Inscripciones abiertas para todas las categorías.",
  },
  "escuela-basquet-juvenil": {
    title: "Escuela de básquet juvenil",
    date: "2026-02-20",
    category: "Básquet",
    body: "Abrimos inscripciones para la escuela de básquet infantil. Entrenamientos martes y jueves.",
  },
  "colonia-de-verano": {
    title: "Colonia de verano 2026",
    date: "2025-12-01",
    category: "Eventos",
    body: "Un verano distinto para los más chicos: deportes, pileta, talleres y excursiones en un solo lugar.",
  },
  "hockey-primera": {
    title: "Hockey primera: nuevo plantel",
    date: "2026-03-05",
    category: "Hockey",
    body: "Conocé a las jugadoras que representarán al club en la próxima temporada de hockey sobre césped.",
  },
  "mejoras-instalaciones": {
    title: "Mejoras en las instalaciones",
    date: "2026-03-18",
    category: "Institucional",
    body: "Repavimentación de canchas, nuevos vestuarios y renovación del salón principal. Conocé el plan de obras.",
  },
} as const;

type Slug = keyof typeof posts;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug as Slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.body,
  };
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug as Slug];
  if (!post) notFound();

  return (
    <Section spacing="lg">
      <Container size="md">
        <NextLink
          className="mb-6 inline-flex items-center gap-2 text-sm text-default-600 hover:text-estu-azul"
          href="/blog"
        >
          <FaArrowLeft size={12} /> Volver al blog
        </NextLink>
        <Eyebrow className="mb-3 block" tone="azul">
          {post.category} · {formatDate(post.date)}
        </Eyebrow>
        <h1 className={title({ size: "lg", class: "block leading-[1.1]" })}>
          {post.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-default-700">
          {post.body}
        </p>
        <p className="mt-6 text-sm text-default-500">
          Artículo placeholder. En producción este contenido provendría del
          CMS del club.
        </p>
      </Container>
    </Section>
  );
}