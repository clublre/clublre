/**
 * Blog posts — single source of truth.
 *
 * Used by both `app/blog/page.tsx` (index) and `app/blog/[slug]/page.tsx`
 * (post detail). Keeping the data here avoids duplication and drift
 * between the two pages.
 *
 * In production this should be replaced with a CMS adapter
 * (Sanity / Contentful / markdown files / DB). The exported shape is
 * the contract the rest of the app relies on.
 *
 * The accent + category lives on the listing row; the `body` lives
 * only on the detail row. `excerpt` is derived from the first sentence
 * of `body` to avoid duplication.
 */

export type PostAccent = 'sky' | 'amarillo' | 'gradient';

export interface BlogPost {
  /** URL slug. Used as the `[slug]` route param and as a `Route` after concat. */
  slug: string;
  /** Display title. */
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Category label (display only, no i18n). */
  category: string;
  /** Accent stripe colour for the listing card. */
  accent: PostAccent;
  /** Short excerpt shown on the index. Falls back to the first 140 chars of `body`. */
  excerpt: string;
  /** Full body shown on the detail page. */
  body: string;
}

/** Order matters — sorted by `date` desc on the index page. */
export const posts: ReadonlyArray<BlogPost> = [
  {
    slug: 'apertura-pileta-2026',
    title: 'Apertura de la pileta 2026',
    date: '2026-01-15',
    category: 'Institucional',
    accent: 'sky',
    excerpt:
      'Volvemos a abrir las puertas de la pileta climatizada. Conocé horarios, valores y novedades para esta temporada.',
    body: 'Volvemos a abrir las puertas de la pileta climatizada. Conocé horarios, valores y novedades para esta temporada.',
  },
  {
    slug: 'torneo-interno-basquet',
    title: 'Torneo interno de básquet 2026',
    date: '2026-02-02',
    category: 'Básquet',
    accent: 'amarillo',
    excerpt:
      'Se viene una nueva edición del clásico torneo interno de básquet. Inscripciones abiertas para todas las categorías.',
    body: 'Se viene una nueva edición del clásico torneo interno de básquet. Inscripciones abiertas para todas las categorías.',
  },
  {
    slug: 'escuela-basquet-juvenil',
    title: 'Escuela de básquet juvenil',
    date: '2026-02-20',
    category: 'Básquet',
    accent: 'sky',
    excerpt:
      'Abrimos inscripciones para la escuela de básquet infantil. Entrenamientos martes y jueves.',
    body: 'Abrimos inscripciones para la escuela de básquet infantil. Entrenamientos martes y jueves.',
  },
  {
    slug: 'colonia-de-verano',
    title: 'Colonia de verano 2026',
    date: '2025-12-01',
    category: 'Eventos',
    accent: 'gradient',
    excerpt:
      'Un verano distinto para los más chicos: deportes, pileta, talleres y excursiones en un solo lugar.',
    body: 'Un verano distinto para los más chicos: deportes, pileta, talleres y excursiones en un solo lugar.',
  },
  {
    slug: 'karate-cinturon-negro',
    title: 'Karate: nuevo cinturón negro 2026',
    date: '2026-03-05',
    category: 'Karate',
    accent: 'amarillo',
    excerpt:
      'Conocé a los nuevos cinturones negros de la escuela de karate del club formados en el ciclo 2025-2026.',
    body: 'Conocé a los nuevos cinturones negros de la escuela de karate del club formados en el ciclo 2025-2026.',
  },
  {
    slug: 'mejoras-instalaciones',
    title: 'Mejoras en las instalaciones',
    date: '2026-03-18',
    category: 'Institucional',
    accent: 'gradient',
    excerpt:
      'Repavimentación de canchas, nuevos vestuarios y renovación del salón principal. Conocé el plan de obras.',
    body: 'Repavimentación de canchas, nuevos vestuarios y renovación del salón principal. Conocé el plan de obras.',
  },
];

/** Index of posts by slug — O(1) lookup for the detail page. */
export const postsBySlug: Readonly<Record<string, BlogPost>> = Object.freeze(
  Object.fromEntries(posts.map((p) => [p.slug, p])),
);

/** Sorted newest-first. */
export const postsNewestFirst: ReadonlyArray<BlogPost> = Object.freeze(
  [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
);
