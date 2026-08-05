---
applyTo: '**/*.{tsx,ts}'
---

# HeroUI v3 + React — gotchas & canonical patterns

Reglas duras que aprendimos a la mala. Leelas antes de tocar
componentes de `@heroui/react` o patrones de React que interactúan
con el ciclo de vida (render, useEffect, useState).

## `<Select>` (single mode)

```tsx
// ❌ v2 syntax — pasa por compilación pero la API real es otra
<Select
  selectedKeys={new Set([filter])}        // plural
  onSelectionChange={(value: Selection) => void}  // Selection, no Key
>

// ✅ v3 single mode
<Select
  selectedKey={filter}                     // singular
  onSelectionChange={(key: Key | null) => void}
>
```

- **Single mode** = `selectedKey` (singular) + `(key: Key | null) => void`
- **Multi mode** = `selectedKeys` (plural) + `(keys: Selection) => void`
- Importar `Key` de `@heroui/react` para tipar el callback

```tsx
import type { Key } from '@heroui/react';

const handleChange = (key: Key | null) => {
  if (key === null) return; // deselección
  // ...
};
```

> ⚠️ La documentación de HeroUI muestra `selectedKeys` + `Selection`
> en single mode. **Es incorrecto** para v3 — la API real usa
> `selectedKey` + `Key | null`. Verificar con `tsc --noEmit`.

## `<Dropdown.Trigger>` NO acepta Button adentro

```tsx
// ❌ button-in-button: <button><button>...</button></button>
//    → "In HTML, <button> cannot be a descendant of <button>" (hydration)
<Dropdown>
  <Dropdown.Trigger>
    <Button variant="primary">Acciones</Button>
  </Dropdown.Trigger>
</Dropdown>

// ✅ El trigger YA es un Button. Aplicar styles via className.
<Dropdown>
  <Dropdown.Trigger className="button button--sm button--primary gap-1.5 font-semibold">
    <span className="inline-flex items-center gap-1.5">
      Acciones
      <CaretDown aria-hidden="true" className="size-3.5" />
    </span>
  </Dropdown.Trigger>
</Dropdown>
```

- `DropdownTriggerProps` **NO** extiende `ButtonProps` de HeroUI — no tiene
  `size`, `variant`, `color`, etc.
- Usar las clases CSS globales de HeroUI Button: `button button--{size}
button--{variant}` aplicadas vía className.
- Para layout horizontal del chevron con el texto, envolver children en
  `<span className="inline-flex items-center gap-1.5">` — sin esto, el
  chevron puede wrappear abajo del texto.

## `<Table>` empty state — usar `renderEmptyState` en `Table.Body`

```tsx
// ❌ overlay afuera del Table — fragile con sticky column + min-w
<Table>
  <Table.ScrollContainer>
    <Table.Content className="min-w-[760px]">
      <Table.Body>
        {rows.map(...)}
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>
  {rows.length === 0 && (
    <div className="absolute inset-0 ...">Empty state aquí</div>
  )}
</Table>

// ✅ patrón HeroUI v3 — el EmptyState vive dentro del Table.Body
<Table>
  <Table.ScrollContainer>
    <Table.Content className="min-h-90 min-w-190">
      <Table.Header>...</Table.Header>
      <Table.Body
        renderEmptyState={() => (
          <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
            {/* icon, title, description, action button */}
          </EmptyState>
        )}
      >
        {rows.map(...)}
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>
</Table>
```

- `EmptyState` con `flex h-full w-full items-center justify-center` se
  centra en el `Table.Body` automáticamente.
- Si necesitás empty states distintos (sin datos vs sin resultados),
  renderizá uno u otro dentro de la misma función `renderEmptyState`.

## `<Table>` `onSortChange` — `column: Key`, no `string`

```tsx
// ❌ cast feo que esconde el type error
onSortChange={
  onSortChange as unknown as (descriptor: {
    column: string;                           // ← string mal
    direction: 'ascending' | 'descending';
  }) => void
}

// ✅ el handler acepta `Key` (RAC type) y valida
type SortableColumn = 'name' | 'role' | 'status' | 'memberSince';

const onSortChange = (descriptor: {
  column: Key;
  direction: 'ascending' | 'descending';
}) => {
  const isValid = (['name', 'role', 'status', 'memberSince'] as const)
    .includes(descriptor.column as SortableColumn);
  setSortDescriptor(
    isValid
      ? { column: descriptor.column as SortableColumn, direction: descriptor.direction }
      : null,
  );
};
```

## React purity — `Date.now()` en render es impure

```tsx
// ❌ "Cannot call impure function during render" (react-hooks/purity)
function Component() {
  const years = Math.floor(
    (Date.now() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 365),
  );
  return <p>{years} años</p>;
}

// ✅ capturar el "now" una vez al mount, con `useState`
function Component() {
  // Tiene que estar ANTES de cualquier early return (regla de Hooks).
  const [referenceNow] = useState(() => Date.now());
  if (!data) return <Loading />;
  const years = Math.floor(
    (referenceNow - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 365),
  );
  return <p>{years} años</p>;
}
```

## `setState` synchronous en `useEffect` → cascading renders

```tsx
// ❌ "Calling setState synchronously within an effect can trigger cascading renders"
useEffect(() => {
  setSpinning(false);
}, [theme]);

// ✅ si el setState es post-acción, hacelo en el event handler
const onPress = () => {
  setSpinning(true);
  setTheme(isLight ? 'dark' : 'light');
  window.setTimeout(() => setSpinning(false), 600);
};
// Si necesitás resync contra un sistema externo, suscribite en el effect
// y llamá setState DENTRO del callback de suscripción, no en el body.
```

## Empty state visual — patrón "card icon"

```tsx
// ❌ icon pelado, sin contenedor, tamaño grande
<MagnifyingGlass className="text-default-400 size-10" />

// ✅ icon chico dentro de un contenedor tinted, como los iconos de las cards
<div className="bg-primary/10 text-primary inline-flex items-center justify-center rounded-2xl p-3">
  <MagnifyingGlass aria-hidden="true" className="size-6" />
</div>
<p className="text-foreground text-sm font-semibold">No encontramos…</p>
<p className="text-default-500 text-xs">Subtítulo muted.</p>
```

- Container `bg-primary/10` (10% sky tint) sobre `bg-surface` = sutil pero
  visible en dark mode.
- `p-3` + `rounded-2xl` → 48×48 con esquinas suaves.
- `size-6` (24px) para el icon, vs `size-10` (40px) que se ve pesado.

## Bulk actions — Dropdown con intersección de acciones

```tsx
const bulkAvailable = useMemo(() => {
  if (selectedCount === 0)
    return { approve: false, reject: false, suspend: false, reactivate: false };
  const selectedIds =
    selectedKeys === 'all' ? sorted.map((m) => m.id) : Array.from(selectedKeys);
  const selectedMembers = selectedIds
    .map((id) => members.find((m) => m.id === id))
    .filter((m): m is Member => Boolean(m));
  return {
    approve: selectedMembers.every((m) => m.accountStatus === 'pending'),
    reject: selectedMembers.every((m) => m.accountStatus === 'pending'),
    suspend:
      isAdmin &&
      selectedMembers.every(
        (m) => m.accountStatus === 'active' && !isAdminRole(m),
      ),
    reactivate: selectedMembers.every((m) => m.accountStatus === 'suspended'),
  };
}, [selectedKeys, sorted, members, currentMember]);

<Dropdown>
  <Dropdown.Trigger>
    Acciones <CaretDown />
  </Dropdown.Trigger>
  <Dropdown.Popover>
    <Dropdown.Menu>
      {anyBulkAvailable ? (
        <>
          <Dropdown.Item
            isDisabled={!bulkAvailable.approve}
            onAction={() => bulk('approve')}
          >
            <Check className="text-success mr-2 size-4" /> Aprobar {n}
          </Dropdown.Item>
          {/* ... 3 items más con isDisabled por acción */}
        </>
      ) : (
        <Dropdown.Item isDisabled>Sin acciones disponibles</Dropdown.Item>
      )}
    </Dropdown.Menu>
  </Dropdown.Popover>
</Dropdown>;
```

Regla: **intersección** (`.every`), no unión. Si mezclás pending + active,
ninguna acción aplica → el item disabled explica por qué.

Limpiar selección al cambiar filtros/sort para evitar leaks:

```tsx
const onFilterChange = (f: Filter) => {
  setFilter(f);
  setPage(1);
  setSelectedKeys(new Set());
};
```

## Icon-only buttons — siempre `aria-label`

```tsx
// ❌ screen reader no puede anunciar el botón
<button onClick={...}><Search /></button>

// ✅ usar el IconButton del proyecto (con aria-label required)
import { IconButton } from '@/components/atoms/IconButton';
<IconButton aria-label="Descargar como CSV" onPress={...}>
  <Download className="size-4" />
</IconButton>
```

`IconButton` envuelve HeroUI Button con `isIconOnly`. El `aria-label` es
**obligatorio** — TypeScript lo fuerza.

## Tooltip sobre IconButton — patrón compuesto

```tsx
// ❌ skip Tooltip.Trigger — el trigger interno no se registra
<Tooltip delay={0} closeDelay={0}>
  <IconButton aria-label="Descargar como CSV">...</IconButton>
  <Tooltip.Content>...</Tooltip.Content>
</Tooltip>

// ✅ wrap en Tooltip.Trigger (la API requiere el wrapper)
<Tooltip delay={0} closeDelay={0}>
  <Tooltip.Trigger>
    <IconButton aria-label="Descargar como CSV">...</IconButton>
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>Descargar {n} como CSV</p>
  </Tooltip.Content>
</Tooltip>
```
