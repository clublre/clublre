'use client';

import { useCallback, useMemo } from 'react';
import {
  Background,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@heroui/react';

import { commission, type CommissionMember } from '@/data/club';
import { OrgNode, type OrgNodeData } from './OrgNode';

const NODE_WIDTH = 232;
const NODE_HEIGHT = 80;
const H_GAP = 32;
const V_GAP = 96;

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
  const root = members.find((m) => !m.reportsTo);
  if (!root) {
    return { nodes: [], edges: [] };
  }

  // BFS para armar niveles.
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
      });
      if (member.reportsTo) {
        edges.push({
          id: `${member.reportsTo}-${member.id}`,
          source: member.reportsTo,
          target: member.id,
          type: 'smoothstep',
          markerEnd: { type: 'arrowclosed' as never },
          style: { stroke: '#0ea5e9', strokeWidth: 1.5 },
        });
      }
    });
  });

  return { nodes, edges };
}

const nodeTypes = { org: OrgNode };

/** Controles custom — reemplaza `<Controls>` de react-flow con la
 *  estética del repo: panel flotante compacto, buttons ghost. */
function OrgControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const onFit = useCallback(() => {
    void fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);
  return (
    <div className="shadow-club absolute right-3 bottom-3 z-10 flex gap-1 rounded-lg bg-surface/95 p-1 ring-1 ring-default-200 backdrop-blur">
      <Button
        isIconOnly
        aria-label="Acercar"
        size="sm"
        variant="ghost"
        onPress={() => {
          void zoomIn({ duration: 150 });
        }}
      >
        +
      </Button>
      <Button
        isIconOnly
        aria-label="Alejar"
        size="sm"
        variant="ghost"
        onPress={() => {
          void zoomOut({ duration: 150 });
        }}
      >
        −
      </Button>
      <Button
        isIconOnly
        aria-label="Restablecer zoom"
        size="sm"
        variant="ghost"
        onPress={onFit}
      >
        ⤢
      </Button>
    </div>
  );
}

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
    <div className="shadow-club relative h-[520px] overflow-hidden rounded-2xl bg-surface">
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
        <Background color="#e2e8f0" gap={20} size={1} />
      </ReactFlow>
      <OrgControls />
    </div>
  );
}