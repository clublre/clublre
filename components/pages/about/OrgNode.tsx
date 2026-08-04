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

/** Tipo del icono retornado por `pickRoleIcon` — cualquier wrapper
 *  de `components/ui/Icons.tsx`. Usamos `ComponentType` con props
 *  abiertas porque los icon wrappers aceptan varias props de Iconify. */
type RoleIcon = ComponentType<Record<string, unknown>>;

/**
 * Mapa rol → icono + tono. Se matchea por substring sobre `member.role`
 * (case-insensitive) para tolerar variaciones futuras como "Presidente
 * honorario" o "Vocal titular 1".
 */
function pickRoleIcon(role: string): { Icon: RoleIcon; tone: 'sky' | 'default' } {
  const r = role.toLowerCase();
  if (r.includes('president')) return { Icon: Crown, tone: 'sky' };
  if (r.includes('vice')) return { Icon: UserCircle, tone: 'sky' };
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
    badge: 'bg-sky-500/15 text-sky-600',
    ring: 'ring-sky-500/30',
  },
  default: {
    badge: 'bg-default-100 text-default-600',
    ring: 'ring-default-200',
  },
} as const;

/**
 * Nodo visual del organigrama. Layout horizontal:
 *  [icono badge]  [ROL]   ← eyebrow uppercase
 *                 [nombre]
 *
 * El nodo raíz (Presidente) recibe acento de marca: ring sky/blue +
 * gradient background sutil. El resto queda neutro para no competir.
 */
export function OrgNode({ data }: NodeProps) {
  const { member, isRoot } = data as OrgNodeData;
  const { Icon, tone } = pickRoleIcon(member.role);
  const palette = TONE_CLASSES[tone];

  return (
    <div
      className={[
        'shadow-club w-56 rounded-xl bg-surface p-3 ring-1',
        isRoot
          ? `${palette.ring} bg-gradient-to-br from-sky-500/8 to-transparent`
          : `${palette.ring}`,
      ].join(' ')}
    >
      <Handle
        className="!bg-transparent !border-none"
        position={Position.Top}
        type="target"
      />

      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className={[
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            palette.badge,
          ].join(' ')}
        >
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={[
              'truncate text-[10px] font-semibold tracking-wider uppercase',
              isRoot ? 'text-sky-600' : 'text-default-500',
            ].join(' ')}
          >
            {member.role}
          </p>
          <p className="text-foreground mt-0.5 truncate text-sm font-semibold">
            {member.name}
          </p>
        </div>
      </div>

      <Handle
        className="!bg-transparent !border-none"
        position={Position.Bottom}
        type="source"
      />
    </div>
  );
}