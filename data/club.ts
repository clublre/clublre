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
  role: string;
  name: string;
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

/** Comisión directiva (placeholder — vendría del CMS). */
export const commission: ReadonlyArray<CommissionMember> = [
  { role: 'Presidente', name: 'Juan Pérez' },
  { role: 'Vicepresidente', name: 'María González' },
  { role: 'Secretario', name: 'Carlos López' },
  { role: 'Tesorero', name: 'Ana Martínez' },
  { role: 'Vocal', name: 'Pedro Rodríguez' },
] as const;

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
