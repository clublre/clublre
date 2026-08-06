'use client';

import { Chip, Table } from '@heroui/react';

import { categories } from '@/data/marketplace';

const TYPE_LABEL = {
  good: 'Sólo bienes',
  service: 'Sólo servicios',
  both: 'Bienes y servicios',
} as const;

// Manager de categorías — solo lectura en maqueta. Producción: form alta/baja
// + drag & drop para reordenar. Built sobre HeroUI v3 Table.
export function CategoriesManager() {
  return (
    <Table aria-label="Lista de categorías">
      <Table.ScrollContainer>
        <Table.Content className="min-w-125">
          <Table.Header>
            <Table.Column isRowHeader>Categoría</Table.Column>
            <Table.Column>Tipo</Table.Column>
            <Table.Column>Icono</Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="text-default-600 py-12 text-center text-sm">
                No hay categorías todavía.
              </div>
            )}
          >
            {categories.map((c) => (
              <Table.Row key={c.id} id={c.id}>
                <Table.Cell className="font-medium">{c.name}</Table.Cell>
                <Table.Cell>
                  <Chip
                    className="capitalize"
                    color="default"
                    size="sm"
                    variant="soft"
                  >
                    {TYPE_LABEL[c.type]}
                  </Chip>
                </Table.Cell>
                <Table.Cell className="text-default-500 font-mono text-xs">
                  {c.icon}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
