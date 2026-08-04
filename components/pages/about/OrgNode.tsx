'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CommissionMember } from '@/data/club';

/** Datos del nodo que se pasa a `<OrgNode>` desde el grafo. */
export interface OrgNodeData extends Record<string, unknown> {
  member: CommissionMember;
  isRoot: boolean;
}

/**
 * Nodo visual del organigrama. Usa un card simple (no HeroUI Card
 * para mantenerlo ligero — son ~10 nodos en pantalla) con el patrón
 * del repo: eyebrow para el rol y tipografía marcada para el nombre.
 * El nodo raíz recibe acento de marca (sky/blue).
 */
export function OrgNode({ data }: NodeProps) {
  const { member, isRoot } = data as OrgNodeData;

  return (
    <div
      className={[
        'shadow-club w-52 rounded-lg border bg-surface p-3 text-center',
        isRoot
          ? 'border-sky-500/40 ring-1 ring-sky-500/20'
          : 'border-default-200',
      ].join(' ')}
    >
      {/* Handles invisibles — solo se usan para conectar edges. */}
      <Handle
        className="!bg-transparent !border-none"
        position={Position.Top}
        type="target"
      />

      <p
        className={[
          'text-xs font-semibold tracking-wider uppercase',
          isRoot ? 'text-sky-600' : 'text-default-500',
        ].join(' ')}
      >
        {member.role}
      </p>
      <p className="text-foreground mt-1.5 text-sm font-semibold">
        {member.name}
      </p>

      <Handle
        className="!bg-transparent !border-none"
        position={Position.Bottom}
        type="source"
      />
    </div>
  );
}