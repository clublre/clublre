// Domain data del club — separado de los tokens visuales en
// `config/design-tokens.ts`. Cuando se wire un CMS, los módulos de
// `data/` quedan como adapters delgados; los tokens siguen siendo
// source-of-truth estático.

export interface Activity {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface CommissionMember {
  /** Identificador único para construir el árbol de organigrama. */
  id: string;
  /** Cargo dentro del club (Presidente, Vocal titular, etc.). */
  role: string;
  /** Nombre completo de la persona. */
  name: string;
  /**
   * `id` del miembro del cual depende directamente. Si está ausente
   * se considera nodo raíz del organigrama. Una sola raíz permitida.
   */
  reportsTo?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: ReadonlyArray<string>;
  highlighted: boolean;
}

/** Actividades que ofrece el club (usadas en home + about). */
export const activities: ReadonlyArray<Activity> = [
  {
    id: 'voley',
    name: 'Vóley',
    description:
      'Escuela de vóley mixto y femenino con entrenamientos y partidos amistosos para todas las edades.',
    icon: '🏐',
  },
  {
    id: 'basquet',
    name: 'Básquet',
    description:
      'Plantel federado con entrenamientos para todas las edades y categorías.',
    icon: '🏀',
  },
  {
    id: 'tenis-de-mesa',
    name: 'Tenis de mesa',
    description:
      'Mesas disponibles para entrenamiento recreativo y competencia federada en categorías juveniles y mayores.',
    icon: '🏓',
  },
  {
    id: 'karate',
    name: 'Karate',
    description:
      'Escuela de karate con clases para chicos y adultos, desde iniciación hasta competencia federada.',
    icon: '🥋',
  },
  {
    id: 'natacion',
    name: 'Natación',
    description:
      'Pileta climatizada con clases para chicos, adultos y entrenamiento competitivo.',
    icon: '🏊',
  },
  {
    id: 'gimnasia',
    name: 'Gimnasia artística',
    description:
      'Iniciación deportiva y competencia federada en todas las edades.',
    icon: '🤸',
  },
] as const;

/** Comisión directiva vigente. */
/**
 * Modelada como árbol (id + reportsTo). El organigrama en
 * `components/pages/about/CommissionSection` lo renderiza con
 * `@xyflow/react`. Mantener jerarquía explícita en los datos (en lugar
 * de agrupar por nivel) facilita futuros cambios y refleja la realidad
 * organizativa.
 */
export const commission: ReadonlyArray<CommissionMember> = [
  { id: 'presidente', role: 'Presidente', name: 'Celeste González' },

  {
    id: 'vicepresidente',
    role: 'Vicepresidente',
    name: 'Héctor Fernando Biscaysaqu',
    reportsTo: 'presidente',
  },
  {
    id: 'secretario',
    role: 'Secretario General',
    name: 'Federico Borgna',
    reportsTo: 'presidente',
  },
  {
    id: 'tesorero',
    role: 'Tesorero',
    name: 'Ariel Martin Arolfo',
    reportsTo: 'presidente',
  },
  {
    id: 'protesorero',
    role: 'Protesorero',
    name: 'Valentino Sguro',
    reportsTo: 'tesorero',
  },

  {
    id: 'vocal-titular-1',
    role: 'Vocal titular',
    name: 'Darío Luis Prato',
    reportsTo: 'secretario',
  },
  {
    id: 'vocal-titular-2',
    role: 'Vocal titular',
    name: 'Jerónimo M. Martoccia',
    reportsTo: 'secretario',
  },
  {
    id: 'vocal-titular-3',
    role: 'Vocal titular',
    name: 'Juan Cruz Estévez',
    reportsTo: 'secretario',
  },

  {
    id: 'vocal-suplente-1',
    role: 'Vocal suplente',
    name: 'Alejandra Eciolaza',
    reportsTo: 'secretario',
  },
  {
    id: 'vocal-suplente-2',
    role: 'Vocal suplente',
    name: 'Florencia Bella',
    reportsTo: 'secretario',
  },
  {
    id: 'vocal-suplente-3',
    role: 'Vocal suplente',
    name: 'Cecilia Albornoz',
    reportsTo: 'secretario',
  },

  {
    id: 'sindico-titular',
    role: 'Síndico titular',
    name: 'Félix O. Seni',
    reportsTo: 'presidente',
  },
  {
    id: 'sindico-suplente',
    role: 'Síndico suplente',
    name: 'Carolina Sánchez',
    reportsTo: 'sindico-titular',
  },
] as const;

/** Metadata de la comisión directiva vigente — fuente de verdad para el
 *  bloque "Aprobada por…" en la página /about. */
export interface CommissionMeta {
  /** Número de acta de la asamblea que aprobó la comisión. */
  actaNumber: string;
  /** Fecha de aprobación (ISO 8601). */
  approvedAt: string;
  /** Tipo de asamblea (e.g. "Asamblea General Ordinaria"). */
  assemblyType: string;
  /** Vigencia de la autoridad en años. */
  tenureYears: number;
}

export const commissionMeta: CommissionMeta = {
  actaNumber: '103',
  approvedAt: '2025-06-03',
  assemblyType: 'Asamblea General Ordinaria',
  tenureYears: 3,
} as const;

/** Planes de cuota (placeholder — vendría del CMS). */
export const pricingTiers: ReadonlyArray<PricingTier> = [
  {
    id: 'individual',
    name: 'Cuota individual',
    price: 8500,
    description: 'Acceso completo a todas las instalaciones y actividades.',
    features: [
      'Acceso a todas las disciplinas',
      'Uso libre de instalaciones',
      'Carnet de socio',
      'Descuentos en eventos',
    ],
    highlighted: false,
  },
  {
    id: 'familiar',
    name: 'Cuota familiar',
    price: 15500,
    description: 'Para grupos familiares de hasta 4 personas.',
    features: [
      'Todo lo de la cuota individual',
      'Incluye a 4 integrantes',
      'Acceso a pileta familiar',
      'Eventos sociales incluidos',
    ],
    highlighted: true,
  },
  {
    id: 'infantil',
    name: 'Cuota infantil',
    price: 4500,
    description: 'Para menores de 12 años. Incluye escuela deportiva.',
    features: [
      'Escuela deportiva',
      'Actividades recreativas',
      'Acompañamiento profesional',
      'Carnet de socio infantil',
    ],
    highlighted: false,
  },
] as const;

export type ActivityId = Activity['id'];
export type PricingTierId = PricingTier['id'];
