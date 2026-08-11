// Posts del blog — single source of truth para index y detail.
// En producción debería venir de un CMS (Sanity / Contentful / MD / DB).

export interface BlogPost {
  /** Slug URL — usado como route param `[slug]`. */
  slug: string;
  /** Título visible. */
  title: string;
  /** Fecha ISO (YYYY-MM-DD). */
  date: string;
  /** Categoría (display only, sin i18n). */
  category: string;
  /** Excerpt corto para el index. */
  excerpt: string;
  /** Body completo para la página de detalle. */
  body: string;
}

export const posts: ReadonlyArray<BlogPost> = [
  {
    slug: 'apertura-pileta-2026',
    title: 'Apertura de la pileta 2026',
    date: '2026-01-15',
    category: 'Institucional',
    excerpt:
      'Volvemos a abrir las puertas de la pileta climatizada. Conocé horarios, valores y novedades para esta temporada.',
    body: 'Volvemos a abrir las puertas de la pileta climatizada. Conocé horarios, valores y novedades para esta temporada.',
  },
  {
    slug: 'torneo-interno-basquet',
    title: 'Torneo interno de básquet 2026',
    date: '2026-02-02',
    category: 'Básquet',
    excerpt:
      'Se viene una nueva edición del clásico torneo interno de básquet. Inscripciones abiertas para todas las categorías.',
    body: 'Se viene una nueva edición del clásico torneo interno de básquet. Inscripciones abiertas para todas las categorías.',
  },
  {
    slug: 'escuela-basquet-juvenil',
    title: 'Escuela de básquet juvenil',
    date: '2026-02-20',
    category: 'Básquet',
    excerpt:
      'Abrimos inscripciones para la escuela de básquet infantil. Entrenamientos Martes y Jueves.',
    body: 'Abrimos inscripciones para la escuela de básquet infantil. Entrenamientos Martes y Jueves.',
  },
  {
    slug: 'colonia-de-verano',
    title: 'Colonia de verano 2026',
    date: '2025-12-01',
    category: 'Eventos',
    excerpt:
      'Un verano distinto para los más chicos: deportes, pileta, talleres y excursiones en un solo lugar.',
    body: 'Un verano distinto para los más chicos: deportes, pileta, talleres y excursiones en un solo lugar.',
  },
  {
    slug: 'karate-cinturon-negro',
    title: 'Karate: nuevo cinturón negro 2026',
    date: '2026-03-05',
    category: 'Karate',
    excerpt:
      'Conocé a los nuevos cinturones negros de la escuela de karate del club formados en el ciclo 2025-2026.',
    body: 'Conocé a los nuevos cinturones negros de la escuela de karate del club formados en el ciclo 2025-2026.',
  },
  {
    slug: 'mejoras-instalaciones',
    title: 'Mejoras en las instalaciones',
    date: '2026-03-18',
    category: 'Institucional',
    excerpt:
      'Repavimentación de canchas, nuevos vestuarios y renovación del salón principal. Conocé el plan de obras.',
    body: 'Repavimentación de canchas, nuevos vestuarios y renovación del salón principal. Conocé el plan de obras.',
  },
];

// Index por slug — lookup O(1) para la página de detalle.
export const postsBySlug: Readonly<Record<string, BlogPost>> = Object.freeze(
  Object.fromEntries(posts.map((p) => [p.slug, p])),
);

// Sorted newest-first.
export const postsNewestFirst: ReadonlyArray<BlogPost> = Object.freeze(
  [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
);
