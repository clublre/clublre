'use client';

import { Chip } from '@heroui/react';

import { categories } from '@/data/marketplace';

const TYPE_LABEL = {
  good: 'Sólo bienes',
  service: 'Sólo servicios',
  both: 'Bienes y servicios',
} as const;

/** Manager de categorías — sólo lectura en la maqueta. En
 *  producción este componente tendría un form para alta / baja
 *  + drag & drop para reordenar. */
export function CategoriesManager() {
  return (
    <div className="bg-surface shadow-club overflow-hidden rounded-2xl">
      <table className="w-full text-left text-sm">
        <thead className="text-default-500 text-xs tracking-wider uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Icono</th>
          </tr>
        </thead>
        <tbody className="divide-default-200/60 divide-y">
          {categories.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-medium">{c.name}</td>
              <td className="px-4 py-3">
                <Chip
                  className="tracking-wider uppercase"
                  color="default"
                  size="sm"
                  variant="soft"
                >
                  {TYPE_LABEL[c.type]}
                </Chip>
              </td>
              <td className="text-default-500 px-4 py-3 font-mono text-xs">
                {c.icon}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
