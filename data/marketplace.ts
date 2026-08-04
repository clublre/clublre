// Mock data para el marketplace "Entre Socios". Es la capa de datos
// del prototipo navegable — todo vive en memoria del cliente y se
// comparte via el `marketplaceStore`. En la versión real, esta
// información se reemplaza por queries a Supabase con la misma forma
// de los tipos.

export type Role = 'member' | 'moderator' | 'admin';

export type AccountStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export type ListingType = 'good' | 'service';

export type ListingCondition = 'new' | 'used' | null;

export type PriceMode = 'fixed' | 'negotiable' | 'free' | 'contact';

export type Currency = 'ARS';

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'reserved'
  | 'sold'
  | 'expired'
  | 'rejected'
  | 'archived';

export interface Category {
  id: string;
  name: string;
  type: ListingType | 'both';
  icon: string;
}

export interface Member {
  id: string;
  /** Nombre completo visible — `"Juan P."` para preservar un poco
   *  de privacidad en listados públicos. */
  fullName: string;
  /** Inicial del apellido. Para no exponer apellidos en el feed. */
  lastInitial: string;
  email: string;
  /** Años como socio — se calcula desde `memberSince`. */
  memberSince: string;
  zone: string;
  accountStatus: AccountStatus;
  role: Role;
  /** Aprobado por — `member.id` o `null` si está pendiente. */
  approvedBy: string | null;
  /** Fecha de aprobación — `null` si está pendiente. */
  approvedAt: string | null;
}

export interface Listing {
  id: string;
  ownerId: string;
  type: ListingType;
  title: string;
  description: string;
  categoryId: string;
  condition: ListingCondition;
  priceMode: PriceMode;
  price: number | null;
  currency: Currency;
  zone: string;
  contactPreference: 'whatsapp' | 'email';
  contactHandle: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  /** Imágenes en orden — strings que se renderizan con `next/image`
   *  o `placeholder` según el modo (maqueta vs real). */
  images: ReadonlyArray<{ id: string; alt: string; src: string }>;
  /** Sólo para motivos de moderación — no se muestra a socios. */
  moderationNote?: string;
}

export type ReportReason =
  'spam' | 'scam' | 'prohibited' | 'harassment' | 'off_topic' | 'other';

export interface Report {
  id: string;
  listingId: string;
  reporterId: string;
  reason: ReportReason;
  detail: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
  resolutionNote?: string;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  targetType: 'member' | 'listing' | 'report' | 'category';
  targetId: string;
  note: string;
  createdAt: string;
}

// ----- Categorías sembradas -----

export const categories: ReadonlyArray<Category> = [
  {
    id: 'indumentaria',
    name: 'Indumentaria deportiva',
    type: 'good',
    icon: 'tshirt',
  },
  { id: 'calzado', name: 'Calzado', type: 'good', icon: 'sneaker' },
  { id: 'natacion', name: 'Natación', type: 'both', icon: 'swimming' },
  { id: 'basquet', name: 'Básquet', type: 'both', icon: 'basketball' },
  {
    id: 'tenis-de-mesa',
    name: 'Tenis de mesa',
    type: 'both',
    icon: 'ping-pong',
  },
  { id: 'gimnasia', name: 'Gimnasia', type: 'both', icon: 'medal' },
  { id: 'voley', name: 'Vóley', type: 'both', icon: 'volleyball' },
  { id: 'karate', name: 'Karate', type: 'both', icon: 'karate' },
  {
    id: 'clases-particulares',
    name: 'Clases particulares',
    type: 'service',
    icon: 'chalkboard',
  },
  {
    id: 'transporte',
    name: 'Transporte / compartir auto',
    type: 'service',
    icon: 'car',
  },
  { id: 'mascotas', name: 'Mascotas', type: 'good', icon: 'paw' },
  {
    id: 'hogar',
    name: 'Artículos del hogar',
    type: 'good',
    icon: 'house-line',
  },
] as const;

// ----- Socios sembrados (incluye admin y moderador) -----

export const seedMembers: ReadonlyArray<Member> = [
  {
    id: 'admin-1',
    fullName: 'María González',
    lastInitial: 'G',
    email: 'comision@clublre.com.ar',
    memberSince: '2008-03-12',
    zone: 'Rosario — Centro',
    accountStatus: 'active',
    role: 'admin',
    approvedBy: null,
    approvedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'mod-1',
    fullName: 'Carlos López',
    lastInitial: 'L',
    email: 'carlos.l@clublre.com.ar',
    memberSince: '2015-07-22',
    zone: 'Rosario — Pichincha',
    accountStatus: 'active',
    role: 'moderator',
    approvedBy: 'admin-1',
    approvedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'member-1',
    fullName: 'Juan Pérez',
    lastInitial: 'P',
    email: 'juan.perez@example.com',
    memberSince: '2018-04-02',
    zone: 'Rosario — Echesortu',
    accountStatus: 'active',
    role: 'member',
    approvedBy: 'admin-1',
    approvedAt: '2026-02-15T14:00:00Z',
  },
  {
    id: 'member-2',
    fullName: 'Ana Martínez',
    lastInitial: 'M',
    email: 'ana.martinez@example.com',
    memberSince: '2019-09-10',
    zone: 'Rosario — Fisherton',
    accountStatus: 'active',
    role: 'member',
    approvedBy: 'admin-1',
    approvedAt: '2026-02-15T14:00:00Z',
  },
  {
    id: 'member-3',
    fullName: 'Pedro Rodríguez',
    lastInitial: 'R',
    email: 'pedro.r@example.com',
    memberSince: '2020-01-20',
    zone: 'Rosario — Abasto',
    accountStatus: 'active',
    role: 'member',
    approvedBy: 'admin-1',
    approvedAt: '2026-02-15T14:00:00Z',
  },
  {
    id: 'member-4',
    fullName: 'Lucía Fernández',
    lastInitial: 'F',
    email: 'lucia.f@example.com',
    memberSince: '2021-06-14',
    zone: 'Rosario — Parque',
    accountStatus: 'active',
    role: 'member',
    approvedBy: 'admin-1',
    approvedAt: '2026-02-15T14:00:00Z',
  },
  {
    id: 'member-5',
    fullName: 'Diego Suárez',
    lastInitial: 'S',
    email: 'diego.s@example.com',
    memberSince: '2022-08-05',
    zone: 'Rosario — Norte',
    accountStatus: 'active',
    role: 'member',
    approvedBy: 'admin-1',
    approvedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'pending-1',
    fullName: 'Sofía Castro',
    lastInitial: 'C',
    email: 'sofia.c@example.com',
    memberSince: '2024-02-10',
    zone: 'Rosario — Sur',
    accountStatus: 'pending',
    role: 'member',
    approvedBy: null,
    approvedAt: null,
  },
  {
    id: 'pending-2',
    fullName: 'Martín López',
    lastInitial: 'L',
    email: 'martin.l@example.com',
    memberSince: '2024-03-22',
    zone: 'Rosario — Oeste',
    accountStatus: 'pending',
    role: 'member',
    approvedBy: null,
    approvedAt: null,
  },
] as const;

// ----- Publicaciones sembradas -----

const monthsAgo = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
};

export const seedListings: ReadonlyArray<Listing> = [
  {
    id: 'listing-1',
    ownerId: 'member-1',
    type: 'good',
    title: 'Botines de básquet talle 42 — casi nuevos',
    description:
      'Los compré en marzo pero cambié de disciplina. Usados apenas dos meses, sin roturas. Ideales para categorías juveniles.',
    categoryId: 'basquet',
    condition: 'used',
    priceMode: 'fixed',
    price: 35000,
    currency: 'ARS',
    zone: 'Rosario — Echesortu',
    contactPreference: 'whatsapp',
    contactHandle: '+54 9 341 555 1234',
    status: 'published',
    createdAt: monthsAgo(1),
    updatedAt: monthsAgo(1),
    images: [
      {
        id: 'img-1-1',
        alt: 'Botines de básquet azul marino, detalle del lateral',
        src: '/logo2.jpeg',
      },
    ],
  },
  {
    id: 'listing-2',
    ownerId: 'member-2',
    type: 'service',
    title: 'Clases particulares de natación para chicos',
    description:
      'Profesora con 10 años de experiencia, doy clases en piletas de Fisherton y Funes. Grupos reducidos de hasta 4 chicos.',
    categoryId: 'natacion',
    condition: null,
    priceMode: 'negotiable',
    price: 8000,
    currency: 'ARS',
    zone: 'Rosario — Fisherton',
    contactPreference: 'email',
    contactHandle: 'ana.martinez@example.com',
    status: 'published',
    createdAt: monthsAgo(2),
    updatedAt: monthsAgo(2),
    images: [],
  },
  {
    id: 'listing-3',
    ownerId: 'member-3',
    type: 'good',
    title: 'Raqueta de tenis de mesa — regalo',
    description:
      'Me la dieron en el club y ya tengo una. La retiro en mano o coordino en la sede.',
    categoryId: 'tenis-de-mesa',
    condition: 'used',
    priceMode: 'free',
    price: null,
    currency: 'ARS',
    zone: 'Rosario — Abasto',
    contactPreference: 'whatsapp',
    contactHandle: '+54 9 341 555 5678',
    status: 'published',
    createdAt: monthsAgo(0),
    updatedAt: monthsAgo(0),
    images: [],
  },
  {
    id: 'listing-4',
    ownerId: 'member-4',
    type: 'good',
    title: 'Malla de gimnasia artística — talle infantil 10',
    description:
      'Mi hija la usó dos temporadas. Estado impecable. La entrego en la sede o cerca de plaza Buratovichich.',
    categoryId: 'gimnasia',
    condition: 'used',
    priceMode: 'fixed',
    price: 12000,
    currency: 'ARS',
    zone: 'Rosario — Parque',
    contactPreference: 'whatsapp',
    contactHandle: '+54 9 341 555 9012',
    status: 'reserved',
    createdAt: monthsAgo(2),
    updatedAt: monthsAgo(0),
    images: [],
  },
  {
    id: 'listing-5',
    ownerId: 'member-5',
    type: 'service',
    title: 'Compro auto usado — pago al contado',
    description:
      'Busco auto chico, modelo 2015 en adelante, hasta 8 millones. Pago al contado y trámite a mi cargo. Sólo Rosario y zona.',
    categoryId: 'transporte',
    condition: null,
    priceMode: 'contact',
    price: null,
    currency: 'ARS',
    zone: 'Rosario — Norte',
    contactPreference: 'whatsapp',
    contactHandle: '+54 9 341 555 3456',
    status: 'published',
    createdAt: monthsAgo(3),
    updatedAt: monthsAgo(3),
    images: [],
  },
  {
    id: 'listing-6',
    ownerId: 'member-1',
    type: 'good',
    title: 'Pesa rusa 12 kg — sin uso',
    description: 'Regalo que nunca aproveché. La paso sin cargo en el club.',
    categoryId: 'karate',
    condition: 'new',
    priceMode: 'free',
    price: null,
    currency: 'ARS',
    zone: 'Rosario — Echesortu',
    contactPreference: 'email',
    contactHandle: 'juan.perez@example.com',
    status: 'published',
    createdAt: monthsAgo(4),
    updatedAt: monthsAgo(4),
    images: [],
  },
  {
    id: 'listing-7',
    ownerId: 'member-2',
    type: 'good',
    title: 'Pelota de vóley Molten — oficial',
    description:
      'Pelota nueva, sin uso. La compré dos veces por error. La vendo a precio de tienda.',
    categoryId: 'voley',
    condition: 'new',
    priceMode: 'fixed',
    price: 95000,
    currency: 'ARS',
    zone: 'Rosario — Fisherton',
    contactPreference: 'whatsapp',
    contactHandle: '+54 9 341 555 1111',
    status: 'pending_review',
    createdAt: monthsAgo(0),
    updatedAt: monthsAgo(0),
    images: [],
  },
];

// ----- Reportes sembrados -----

export const seedReports: ReadonlyArray<Report> = [
  {
    id: 'report-1',
    listingId: 'listing-5',
    reporterId: 'member-3',
    reason: 'off_topic',
    detail:
      'No me parece un producto del club, parece más bien una búsqueda personal.',
    status: 'open',
    createdAt: monthsAgo(1),
  },
];

// ----- Auditoría sembrada -----

export const seedAudit: ReadonlyArray<AuditEntry> = [
  {
    id: 'audit-1',
    actorId: 'admin-1',
    action: 'Aprobó alta de socio',
    targetType: 'member',
    targetId: 'member-1',
    note: 'Cotejado contra padrón 2026.',
    createdAt: '2026-02-15T14:00:00Z',
  },
  {
    id: 'audit-2',
    actorId: 'mod-1',
    action: 'Marcó publicación como reservada',
    targetType: 'listing',
    targetId: 'listing-4',
    note: 'Solicitado por la vendedora.',
    createdAt: monthsAgo(0),
  },
];

// ----- Helpers -----

export const findMember = (
  id: string,
  members: ReadonlyArray<Member>,
): Member | undefined => members.find((m) => m.id === id);

export const findCategory = (
  id: string,
  cats: ReadonlyArray<Category>,
): Category | undefined => cats.find((c) => c.id === id);
