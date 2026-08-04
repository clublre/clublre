'use client';

import { useMemo } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { commission, type CommissionMember } from '@/data/club';
import { OrgNode, type OrgNodeData } from './OrgNode';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 76;
const H_GAP = 32;
const V_GAP = 80;

/**
 * Construye nodos y edges para el organigrama a partir del array
 * plano de `commission`. Layout top-down manual:
 *  - Nivel 0 (raíz): centrado horizontalmente
 *  - Niveles siguientes: distribuidos uniformemente debajo de su padre
 *
 * Manual en vez de elk/dagre para mantener el bundle chico y predecible.
 * Si la maqueta crece a >20 personas conviene moverlo a `lib/org-chart.ts`.
 */
function buildOrgGraph(
  members: ReadonlyArray<CommissionMember>,
): { nodes: Node<OrgNodeData>[]; edges: Edge[] } {
  const byId = new Map(members.map((m) => [m.id, m] as const));
  const root = members.find((m) => !m.reportsTo);
  if (!root) {
    return { nodes: [], edges: [] };
  }

  // Construimos el árbol por niveles (BFS).
  const levels: CommissionMember[][] = [];
  const queue: { node: CommissionMember; depth: number }[] = [
    { node: root, depth: 0 },
  ];
  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    const { node, depth } = item;
    levels[depth] = levels[depth] ?? [];
    levels[depth].push(node);
    const children = members.filter((m) => m.reportsTo === node.id);
    for (const child of children) {
      queue.push({ node: child, depth: depth + 1 });
    }
  }

  // Posicionamos cada nivel.
  const nodes: Node<OrgNodeData>[] = [];
  const edges: Edge[] = [];
  const levelWidths: number[] = levels.map(
    (lvl) => lvl.length * NODE_WIDTH + (lvl.length - 1) * H_GAP,
  );
  const maxLevelWidth = Math.max(...levelWidths);

  levels.forEach((level, depth) => {
    const levelWidth = levelWidths[depth] ?? 0;
    const startX = (maxLevelWidth - levelWidth) / 2;
    level.forEach((member, index) => {
      const x = startX + index * (NODE_WIDTH + H_GAP);
      const y = depth * (NODE_HEIGHT + V_GAP);
      nodes.push({
        id: member.id,
        type: 'org',
        position: { x, y },
        data: { member, isRoot: depth === 0 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });
      if (member.reportsTo && byId.has(member.reportsTo)) {
        edges.push({
          id: `${member.reportsTo}-${member.id}`,
          source: member.reportsTo,
          target: member.id,
          type: 'smoothstep',
          animated: false,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' },
          style: { stroke: '#0ea5e9', strokeWidth: 1.5 },
        });
      }
    });
  });

  return { nodes, edges };
}

const nodeTypes = { org: OrgNode };

/**
 * Wrapper client del organigrama. Se importa via `next/dynamic` desde
 * `CommissionSection` (server) para evitar SSR (react-flow usa
 * ResizeObserver y similares).
 */
export function OrgChart() {
  const { nodes, edges } = useMemo(
    () => buildOrgGraph(commission),
    [],
  );

  return (
    <div className="bg-surface shadow-club h-[520px] overflow-hidden rounded-2xl border border-default-200">
      <ReactFlow
        fitView
        defaultEdgeOptions={{ type: 'smoothstep' }}
        edges={edges}
        fitViewOptions={{ padding: 0.2, maxZoom: 1.1 }}
        maxZoom={1.5}
        minZoom={0.5}
        nodeTypes={nodeTypes}
        nodes={nodes}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={16} size={1} />
        <Controls
          className="!bg-surface !border-default-200"
          position="bottom-right"
          showInteractive={false}
        />
        <MiniMap
          pannable
          zoomable
          className="!bg-surface !border-default-200"
          maskColor="rgba(14, 165, 233, 0.08)"
          position="bottom-left"
        />
      </ReactFlow>
    </div>
  );
}