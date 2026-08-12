import type { ComponentType } from 'react';

import {
  Crown,
  Notebook,
  Shield,
  User,
  UserCircle,
  Wallet,
} from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { commission, type CommissionMember } from '@/data/club';

// Mapeo rol → icono + tono. Presidente usa un crown distintivo.
function pickRoleVisuals(role: string): {
  Icon: ComponentType<Record<string, unknown>>;
  tone: 'sky' | 'default';
} {
  const r = role.toLowerCase();
  if (r.includes('president')) return { Icon: Crown, tone: 'sky' };
  if (r.includes('vice')) return { Icon: UserCircle, tone: 'sky' };
  if (r.includes('secret')) return { Icon: Notebook, tone: 'sky' };
  if (r.includes('tesor')) return { Icon: Wallet, tone: 'sky' };
  if (r.includes('síndico') || r.includes('sindico'))
    return { Icon: Shield, tone: 'sky' };
  if (r.includes('suplente')) return { Icon: User, tone: 'default' };
  if (r.includes('vocal')) return { Icon: User, tone: 'default' };
  return { Icon: User, tone: 'default' };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}

// Clasificación de level 2 para los sub-grupos del organigrama.
// Mantener centralizada — la usan tanto el render como cualquier
// consumidor futuro (filtros, búsqueda, etc.).
const isVocalTitular = (m: CommissionMember) => {
  const r = m.role.toLowerCase();
  return r.includes('vocal') && !r.includes('suplente');
};
const isVocalSuplente = (m: CommissionMember) => {
  const r = m.role.toLowerCase();
  return r.includes('vocal') && r.includes('suplente');
};

/**
 * Card minimalista estilo Vercel/Linear:
 * - Avatar gradient con iniciales (sin círculo blanco)
 * - Nombre grande bold como focal point
 * - Role pequeño uppercase tracked
 * - Icon accent en la esquina superior derecha
 * - Hover: lift sutil + ring color emerge
 * - Theme-adaptive via tokens del repo
 *
 * `isSuplente` aplica una atenuación sutil (avatar más chico,
 * opacidad bajada) para diferenciar titulares de suplentes sin
 * romper la coherencia visual del grupo.
 */
function MemberCard({
  member,
  isRoot,
  isSuplente,
}: {
  member: CommissionMember;
  isRoot: boolean;
  isSuplente: boolean;
}) {
  const { Icon, tone } = pickRoleVisuals(member.role);
  const initials = getInitials(member.name);

  // Tamaños escalonados: root > titular > suplente.
  const avatarSize = isRoot ? 'size-16' : isSuplente ? 'size-10' : 'size-12';
  const initialsSize = isRoot
    ? 'text-xl'
    : isSuplente
      ? 'text-sm'
      : 'text-base';

  return (
    <article
      className={cn(
        'group relative isolate flex flex-col gap-5 rounded-2xl p-5 transition-[transform,box-shadow,ring-color] duration-300',
        // bg-surface-secondary adapta light/dark sin tocar dark:.
        'bg-surface-secondary ring-default-200/70 ring-1',
        'shadow-sm hover:-translate-y-1 hover:shadow-lg',
        // Ring hover: emerge al tono del cargo.
        isRoot
          ? 'hover:ring-sky-500/50 dark:hover:ring-sky-400/40'
          : tone === 'sky'
            ? 'hover:ring-sky-500/40 dark:hover:ring-sky-400/30'
            : 'hover:ring-default-300 dark:hover:ring-default-100/40',
        // Suplentes: atenuación global sutil para que el ojo los
        // perciba como "segunda línea" sin perder legibilidad.
        !isRoot && isSuplente && 'opacity-90',
      )}
    >
      {/* Glow gradient al hover (decorativo) */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          isRoot
            ? 'bg-linear-to-br from-sky-500/10 via-transparent to-sky-500/5'
            : tone === 'sky'
              ? 'bg-linear-to-br from-sky-500/8 via-transparent to-sky-500/3'
              : 'from-foreground/5 to-foreground/0 bg-linear-to-br via-transparent',
        )}
      />

      {/* Header: avatar + role icon accent */}
      <div className="flex items-start justify-between">
        <div
          aria-hidden="true"
          className={cn(
            'flex items-center justify-center rounded-full ring-2 transition-transform group-hover:scale-105',
            avatarSize,
            tone === 'sky'
              ? 'bg-linear-to-br from-sky-400/30 via-sky-500/20 to-sky-600/25 text-sky-700 ring-sky-500/30 dark:from-sky-400/20 dark:via-sky-500/15 dark:to-sky-600/15 dark:text-sky-200 dark:ring-sky-400/25'
              : 'from-foreground/15 via-foreground/10 to-foreground/5 text-foreground/80 ring-foreground/15 dark:from-foreground/10 dark:via-foreground/5 dark:to-foreground/0 bg-linear-to-br',
          )}
        >
          <span className={cn('font-semibold tracking-tight', initialsSize)}>
            {initials}
          </span>
        </div>
        <div
          aria-hidden="true"
          className={cn(
            'flex size-8 items-center justify-center rounded-lg transition-colors',
            tone === 'sky'
              ? 'bg-sky-500/10 text-sky-500/70 group-hover:bg-sky-500/15 group-hover:text-sky-500'
              : 'bg-foreground/5 text-foreground/40 group-hover:bg-foreground/10 group-hover:text-foreground/70',
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
        </div>
      </div>

      {/* Body: role + nombre */}
      <div className="flex-1">
        <p
          className={cn(
            'text-[10px] font-semibold tracking-wider uppercase',
            tone === 'sky'
              ? 'text-sky-600/80 dark:text-sky-300/80'
              : 'text-foreground/50',
            !isRoot && isSuplente && 'opacity-75',
          )}
        >
          {member.role}
        </p>
        <h3
          className={cn(
            'text-foreground mt-1.5 font-semibold tracking-tight',
            isRoot ? 'text-2xl' : 'text-lg',
          )}
        >
          {member.name}
        </h3>
      </div>

      {/* Footer: subtle accent line (root only) */}
      {isRoot && (
        <div
          aria-hidden="true"
          className="absolute inset-x-5 bottom-0 h-px bg-linear-to-r from-transparent via-sky-500/30 to-transparent"
        />
      )}
    </article>
  );
}

/** Sub-grupo del organigrama con heading + grid auto-fit. */
function Subgroup({
  title,
  members,
}: {
  title: string;
  members: ReadonlyArray<CommissionMember>;
}) {
  if (members.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h4 className="text-foreground/60 text-xs font-semibold tracking-wider uppercase">
        {title}
      </h4>
      <div className="grid-auto-fit-220 grid gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            isRoot={false}
            isSuplente={member.role.toLowerCase().includes('suplente')}
            member={member}
          />
        ))}
      </div>
    </section>
  );
}

/** Línea conectora vertical entre niveles del organigrama. */
function Connector() {
  return (
    <div
      aria-hidden="true"
      className="from-default-300/50 dark:from-default-100/30 mx-auto h-6 w-px bg-linear-to-b to-transparent"
    />
  );
}

/**
 * Layout de la comisión directiva:
 * - Presidente (featured)
 * - Línea conectora
 * - Level 1: ejecutivos + síndico titular (4 cards, auto-fit)
 * - Línea conectora
 * - Level 2 con sub-grupos:
 *   - Vocales titulares
 *   - Vocales suplentes
 *   - Otros cargos (protesorero + síndico suplente)
 *
 * Los grids usan `grid-auto-fit-220`/`260` (definidas en
 * `styles/globals.css`) — se adaptan al viewport sin media queries.
 */
export function CommissionGrid() {
  const root = commission.find((m) => !m.reportsTo);
  if (!root) return null;

  const level1 = commission.filter((m) => m.reportsTo === root.id);
  const level2 = commission.filter(
    (m) => m.reportsTo && m.reportsTo !== root.id,
  );

  const vocalesTitulares = level2.filter(isVocalTitular);
  const vocalesSuplentes = level2.filter(isVocalSuplente);
  const otrosCargos = level2.filter(
    (m) => !isVocalTitular(m) && !isVocalSuplente(m),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Presidente — card featured, centrada */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <MemberCard isRoot isSuplente={false} member={root} />
        </div>
      </div>

      {level1.length > 0 && <Connector />}

      {/* Nivel 1 — ejecutivos + síndico titular */}
      {level1.length > 0 && (
        <div className="grid-auto-fit-260 grid gap-4">
          {level1.map((member) => (
            <MemberCard
              key={member.id}
              isRoot={false}
              isSuplente={false}
              member={member}
            />
          ))}
        </div>
      )}

      {level2.length > 0 && <Connector />}

      {/* Nivel 2 — sub-grupos */}
      <Subgroup members={vocalesTitulares} title="Vocales titulares" />
      <Subgroup members={vocalesSuplentes} title="Vocales suplentes" />
      <Subgroup members={otrosCargos} title="Otros cargos" />
    </div>
  );
}
