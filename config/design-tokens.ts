/**
 * Club LRE — Design tokens (TypeScript)
 *
 * Source of truth for tokens that live both in styles/globals.css (@theme)
 * and in code (tailwind-variants, classes, etc).
 *
 * CSS variables live in globals.css under `@theme { ... }` — keep these
 * constants in sync with the @theme block there.
 */

export const brand = {
  /** Primary brand blue (Club Atlético Estudiantil) */
  azul: "#0009A0",
  /** Primary brand yellow */
  amarillo: "#EEE457",
  /** Reverse: yellow → blue */
  gradient1: "linear-gradient(to right, #0009A0, #EEE457)",
  /** Forward: blue → yellow */
  gradient2: "linear-gradient(to right, #EEE457, #0009A0)",
} as const;

export const spacing = {
  section: "py-16 md:py-24",
  container: "px-6 mx-auto max-w-7xl",
} as const;

export const radii = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
} as const;

export const typography = {
  display: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
  h1: "text-4xl md:text-5xl font-bold tracking-tight",
  h2: "text-3xl md:text-4xl font-semibold tracking-tight",
  h3: "text-2xl md:text-3xl font-semibold",
  h4: "text-xl md:text-2xl font-semibold",
  body: "text-base md:text-lg leading-relaxed",
  small: "text-sm text-default-600",
  eyebrow:
    "text-xs uppercase tracking-[0.2em] font-medium text-default-500",
} as const;

/** Activities offered by the club (used across home + about pages). */
export const activities = [
  {
    id: "futbol",
    name: "Fútbol",
    description:
      "Canchas de césped sintético para entrenamientos y partidos amistosos.",
    icon: "⚽",
  },
  {
    id: "basquet",
    name: "Básquet",
    description:
      "Plantel federado con entrenamientos para todas las edades y categorías.",
    icon: "🏀",
  },
  {
    id: "natacion",
    name: "Natación",
    description:
      "Pileta climatizada con clases para chicos, adultos y entrenamiento competitivo.",
    icon: "🏊",
  },
  {
    id: "tenis",
    name: "Tenis",
    description:
      "Canchas de polvo de ladrillo y clases individuales o grupales.",
    icon: "🎾",
  },
  {
    id: "hockey",
    name: "Hockey",
    description:
      "Escuela de hockey sobre césped para infantiles y primera división.",
    icon: "🏑",
  },
  {
    id: "gimnasia",
    name: "Gimnasia artística",
    description:
      "Iniciación deportiva y competencia federada en todas las edades.",
    icon: "🤸",
  },
] as const;

export type Activity = (typeof activities)[number];

/** Commission / directiva (placeholder — would come from CMS). */
export const commission = [
  { role: "Presidente", name: "Juan Pérez" },
  { role: "Vicepresidente", name: "María González" },
  { role: "Secretario", name: "Carlos López" },
  { role: "Tesorero", name: "Ana Martínez" },
  { role: "Vocal", name: "Pedro Rodríguez" },
] as const;

/** Pricing tiers (placeholder — would come from CMS). */
export const pricingTiers = [
  {
    id: "individual",
    name: "Cuota individual",
    price: 8500,
    description: "Acceso completo a todas las instalaciones y actividades.",
    features: [
      "Acceso a todas las disciplinas",
      "Uso libre de instalaciones",
      "Carnet de socio",
      "Descuentos en eventos",
    ],
    highlighted: false,
  },
  {
    id: "familiar",
    name: "Cuota familiar",
    price: 15500,
    description: "Para grupos familiares de hasta 4 personas.",
    features: [
      "Todo lo de la cuota individual",
      "Incluye a 4 integrantes",
      "Acceso a pileta familiar",
      "Eventos sociales incluidos",
    ],
    highlighted: true,
  },
  {
    id: "infantil",
    name: "Cuota infantil",
    price: 4500,
    description: "Para menores de 12 años. Incluye escuela deportiva.",
    features: [
      "Escuela deportiva",
      "Actividades recreativas",
      "Acompañamiento profesional",
      "Carnet de socio infantil",
    ],
    highlighted: false,
  },
] as const;

export type PricingTier = (typeof pricingTiers)[number];