'use client';

import type { ComponentType } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Calculator,
  Crown,
  Notebook,
  Trophy,
  User,
  UserCircle,
  Wallet,
} from '@/components/ui/Icons';
import type { CommissionMember } from '@/data/club';

/** Datos del nodo que se pasa a `<OrgNode>` desde el grafo. */
export interface OrgNodeData extends Record<string, unknown> {
  member: CommissionMember;
  isRoot: boolean;
}

type RoleIcon = ComponentType<Record<string, unknown>>;

/**
 * Mapa rol → icono + tono. Se matchea por substring sobre `member.role`
 * (case-insensitive) para tolerar variaciones futuras.
 */
function pickRoleIcon(role: string): {
  Icon: RoleIcon;
  tone: 'sky' | 'default';
} {
  const r = role.toLowerCase();
  // Orden importa: chequear los matches más específicos primero
  // para que "Vicepresidente" no matchee "president" antes que "vice".
  if (r.includes('vice')) return { Icon: UserCircle, tone: 'sky' };
  if (r.includes('president')) return { Icon: Crown, tone: 'sky' };
  if (r.includes('secret')) return { Icon: Notebook, tone: 'sky' };
  if (r.includes('tesor')) return { Icon: Wallet, tone: 'sky' };
  if (r.includes('suplente')) return { Icon: User, tone: 'default' };
  if (r.includes('vocal')) return { Icon: User, tone: 'default' };
  if (r.includes('hacienda')) return { Icon: Calculator, tone: 'default' };
  if (r.includes('deportes')) return { Icon: Trophy, tone: 'default' };
  return { Icon: User, tone: 'default' };
}

const TONE_CLASSES = {
  sky: {
    iconBg: 'bg-sky-500/20 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300',
    iconRing: 'ring-sky-500/30 dark:ring-sky-400/20',
  },
  default: {
    iconBg: 'bg-foreground/10 text-foreground/70 dark:bg-foreground/8',
    iconRing: 'ring-foreground/15 dark:ring-foreground/10',
  },
} as const;

/**
 * Nodo del organigrama — explícitamente theme-adaptive con variantes
 * `dark:` en todos los colores de fondo. En light mode es blanco,
 * en dark mode es gris oscuro.
 *
 *  ┌─────────────────┐
 *  │                 │
 *  │     [icon]       │  ← 14×14, color adaptivo light/dark
 *  │                 │
 *  │      ROL        │  ← text-default-500 (adapta a tema)
 *  │     Nombre      │  ← text-foreground
 *  │                 │
 *  └─────────────────┘
 */
export function OrgNode({ data }: NodeProps) {
  const { member, isRoot } = data as OrgNodeData;
  const { Icon, tone } = pickRoleIcon(member.role);
  const palette = TONE_CLASSES[tone];

  return (
    <div
      className={[
        'from-surface to-default-50/30 dark:from-default-900/40 dark:to-default-800/20 dark:bg-default-200/15 shadow-club w-44 rounded-2xl bg-gradient-to-b p-6 text-center ring-1 backdrop-blur-sm dark:shadow-[0_1px_2px_0_rgba(255,255,255,0.04),0_2px_6px_0_rgba(255,255,255,0.02)]',
        isRoot
          ? 'from-sky-500/15 ring-sky-500/40 dark:from-sky-400/10 dark:ring-sky-400/50'
          : 'ring-default-200/70 dark:ring-default-200/40',
      ].join(' ')}
    >
      <Handle
        className="!border-none !bg-transparent"
        position={Position.Top}
        type="target"
      />

      <div
        aria-hidden="true"
        className={[
          'mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl ring-1',
          palette.iconBg,
          palette.iconRing,
        ].join(' ')}
      >
        <Icon aria-hidden="true" className="size-7" />
      </div>

      <p className="text-default-600 dark:text-default-400 truncate text-[10px] font-semibold tracking-wider uppercase">
        {member.role}
      </p>
      <p className="text-foreground mt-1.5 truncate text-sm font-semibold">
        {member.name}
      </p>

      <Handle
        className="!border-none !bg-transparent"
        position={Position.Bottom}
        type="source"
      />
    </div>
  );
}
