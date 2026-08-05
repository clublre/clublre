'use client';

import { useMemo } from 'react';
import { Input, ListBox, Select } from '@heroui/react';

import { cn } from '@/lib/utils';
import { type Listing, type Category, categories } from '@/data/marketplace';

export interface MarketplaceFilterState {
  q: string;
  categoryId: string;
  type: 'all' | Listing['type'];
  sort: 'newest' | 'price_asc' | 'price_desc';
}

interface MarketplaceFiltersProps {
  state: MarketplaceFilterState;
  onChange: (next: MarketplaceFilterState) => void;
  total: number;
}

const TYPE_OPTIONS: ReadonlyArray<{
  id: 'all' | Listing['type'];
  label: string;
}> = [
  { id: 'all', label: 'Todo' },
  { id: 'good', label: 'Bienes' },
  { id: 'service', label: 'Servicios' },
];

const SORT_OPTIONS: ReadonlyArray<{
  id: MarketplaceFilterState['sort'];
  label: string;
}> = [
  { id: 'newest', label: 'Más recientes' },
  { id: 'price_asc', label: 'Menor precio' },
  { id: 'price_desc', label: 'Mayor precio' },
];

/** Filtros del listado de Entre Socios. La maqueta usa Selects
 *  nativos estilados por HeroUI — el backend real los persistirá
 *  en search params para deep-linkability. */
export function MarketplaceFilters({
  state,
  onChange,
  total,
}: MarketplaceFiltersProps) {
  const totalLabel = useMemo(() => {
    if (total === 0) return 'Sin resultados';
    if (total === 1) return '1 publicación';
    return `${total} publicaciones`;
  }, [total]);

  // Las categorías se filtran según el `type` activo — si el socio
  // eligió "Servicios", las de tipo `good` se ocultan.
  const visibleCategories: ReadonlyArray<Category> = useMemo(() => {
    if (state.type === 'all') return categories;
    return categories.filter((c) => c.type === 'both' || c.type === state.type);
  }, [state.type]);

  // Hay filtros activos cuando el usuario modificó algo respecto del
  // estado default. Sort default es `newest`, así que no entrar ahí.
  // Contamos cuántos para mostrar "Limpiar N filtros" en el pill.
  const activeFilterCount =
    (state.q.trim() !== '' ? 1 : 0) +
    (state.categoryId !== 'all' ? 1 : 0) +
    (state.type !== 'all' ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="bg-surface shadow-club mb-6 rounded-2xl p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Input
            aria-label="Buscar"
            placeholder="Botines, raqueta, clases…"
            type="search"
            value={state.q}
            onChange={(e) => onChange({ ...state, q: e.target.value })}
          />
          {state.q ? (
            <button
              aria-label="Limpiar búsqueda"
              className="text-default-400 hover:text-default-700 absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-xs transition-colors"
              onClick={() => onChange({ ...state, q: '' })}
            >
              <span aria-hidden="true">×</span>
            </button>
          ) : null}
        </div>
        <Select
          aria-label="Categoría"
          placeholder={
            state.categoryId === 'all'
              ? 'Todas las categorías'
              : (visibleCategories.find((c) => c.id === state.categoryId)
                  ?.name ?? 'Categoría')
          }
          selectedKey={
            state.categoryId === 'all' ? undefined : state.categoryId
          }
          onChange={(k) =>
            onChange({
              ...state,
              categoryId: typeof k === 'string' ? k : 'all',
            })
          }
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="all" textValue="Todas las categorías">
                Todas las categorías
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {visibleCategories.map((c) => (
                <ListBox.Item key={c.id} id={c.id} textValue={c.name}>
                  {c.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          aria-label="Tipo"
          placeholder={
            TYPE_OPTIONS.find((t) => t.id === state.type)?.label ?? 'Tipo'
          }
          selectedKey={state.type}
          onChange={(k) =>
            onChange({
              ...state,
              type: (k as MarketplaceFilterState['type']) ?? 'all',
              categoryId: 'all',
            })
          }
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {TYPE_OPTIONS.map((t) => (
                <ListBox.Item key={t.id} id={t.id} textValue={t.label}>
                  {t.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          aria-label="Orden"
          placeholder={
            SORT_OPTIONS.find((s) => s.id === state.sort)?.label ?? 'Orden'
          }
          selectedKey={state.sort}
          onChange={(k) =>
            onChange({
              ...state,
              sort: (k as MarketplaceFilterState['sort'] | null) ?? 'newest',
            })
          }
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {SORT_OPTIONS.map((s) => (
                <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                  {s.label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
      {hasActiveFilters ? (
        <div
          aria-label="Filtros activos"
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          {state.q.trim() !== '' ? (
            <button
              className="bg-primary/15 text-primary hover:bg-primary/25 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
              onClick={() => onChange({ ...state, q: '' })}
            >
              “{state.q.trim()}”
              <span aria-hidden="true" className="text-base leading-none">
                ×
              </span>
            </button>
          ) : null}
          {state.categoryId !== 'all' ? (
            <button
              className="bg-primary/15 text-primary hover:bg-primary/25 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
              onClick={() => onChange({ ...state, categoryId: 'all' })}
            >
              {categories.find((c) => c.id === state.categoryId)?.name ??
                'Categoría'}
              <span aria-hidden="true" className="text-base leading-none">
                ×
              </span>
            </button>
          ) : null}
          {state.type !== 'all' ? (
            <button
              className="bg-primary/15 text-primary hover:bg-primary/25 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
              onClick={() => onChange({ ...state, type: 'all' })}
            >
              {TYPE_OPTIONS.find((t) => t.id === state.type)?.label ?? 'Tipo'}
              <span aria-hidden="true" className="text-base leading-none">
                ×
              </span>
            </button>
          ) : null}
          <button
            className={cn(
              'text-default-500 hover:text-primary text-xs transition-colors',
              activeFilterCount > 1 ? 'ml-1' : 'ml-0',
            )}
            onClick={() =>
              onChange({
                q: '',
                categoryId: 'all',
                type: 'all',
                sort: 'newest',
              })
            }
          >
            Limpiar todo
          </button>
        </div>
      ) : null}
      <p className="text-default-500 mt-3 text-xs">{totalLabel}</p>
    </div>
  );
}
