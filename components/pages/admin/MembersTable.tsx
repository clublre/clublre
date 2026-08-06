'use client';

import { useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Dropdown,
  EmptyState,
  Label,
  ListBox,
  Pagination,
  SearchField,
  Select,
  Table,
  Tooltip,
} from '@heroui/react';
import type { Key, Selection } from '@heroui/react';

import { useAuthStore, useCurrentMember } from '@/stores/auth-store';
import { type Member } from '@/data/marketplace';
import { RoleBadge, StatusBadge } from '@/components/atoms/StatusBadge';
import { IconButton } from '@/components/atoms/IconButton';
import { downloadCsv, toCsv } from '@/lib/csv';
import {
  CaretDown,
  Check,
  DotsVertical,
  Download,
  FunnelX,
  Gear,
  MagnifyingGlass,
  Pause,
  Play,
  Users,
  X,
} from '@/components/ui/Icons';

const isAdminRole = (m: Member) => m.role === 'admin';

const filterLabel = {
  all: 'Todos',
  pending: 'Pendientes',
  active: 'Activos',
  suspended: 'Suspendidos',
  rejected: 'Rechazados',
} as const;

type Filter = keyof typeof filterLabel;

const FILTER_OPTIONS: ReadonlyArray<Filter> = [
  'all',
  'pending',
  'active',
  'suspended',
  'rejected',
];

/** Columnas sortables. Centralizado para evitar typos entre
 *  el header y el comparador. */
type SortableColumn = 'name' | 'role' | 'status' | 'memberSince';

const ROLE_ORDER: Record<Member['role'], number> = {
  admin: 0,
  moderator: 1,
  member: 2,
};

const STATUS_ORDER: Record<Member['accountStatus'], number> = {
  pending: 0,
  active: 1,
  suspended: 2,
  rejected: 3,
};

/** Habilita/deshabilita el kebab de fila — no mostrar menú
 *  con un solo item "Sin acciones". */
const hasActions = (member: Member, viewer: Member | null): boolean => {
  if (member.accountStatus === 'pending') return true;
  if (member.accountStatus === 'suspended') return true;
  if (
    member.accountStatus === 'active' &&
    !isAdminRole(member) &&
    viewer?.role === 'admin'
  ) {
    return true;
  }
  return false;
};

const ROWS_PER_PAGE = 8;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase();
  return (
    (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')
  ).toUpperCase();
};


const compareMembers =
  (column: SortableColumn) =>
  (a: Member, b: Member): number => {
    switch (column) {
      case 'name':
        return a.fullName.localeCompare(b.fullName, 'es');
      case 'role':
        return ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
      case 'status':
        return STATUS_ORDER[a.accountStatus] - STATUS_ORDER[b.accountStatus];
      case 'memberSince':
        // ISO `YYYY-MM-DD` se ordena bien como string.
        return a.memberSince.localeCompare(b.memberSince);
    }
  };

/** Tabla admin de socios: filter + search + sort + bulk actions
 *  + pagination. Built sobre HeroUI v3 Table (a11y gratis). */
export function MembersTable() {
  const members = useAuthStore((s) => s.members);
  const approve = useAuthStore((s) => s.approveMember);
  const reject = useAuthStore((s) => s.rejectMember);
  const suspend = useAuthStore((s) => s.suspendMember);
  const currentMember = useCurrentMember();

  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  /** Sort descriptor controlado por la tabla. `column` es el `id`
   *  del `<Table.Column>` que está activo; `direction` es la flecha.
   *  Empezamos sin sort para mantener el orden natural del store. */
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: SortableColumn;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Filter + search en un solo pass.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (filter !== 'all' && m.accountStatus !== filter) return false;
      if (!q) return true;
      return (
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.zone.toLowerCase().includes(q)
      );
    });
  }, [members, filter, query]);

  // Sort separado del filter para que cambiar filtros no pierda el orden.
  const sorted = useMemo(() => {
    if (!sortDescriptor) return filtered;
    const cmp = compareMembers(sortDescriptor.column);
    const sortedArr = [...filtered].sort(cmp);
    if (sortDescriptor.direction === 'descending') sortedArr.reverse();
    return sortedArr;
  }, [filtered, sortDescriptor]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );

  // Reset a página 1 cuando cambian filtros/búsqueda/sort y limpiar
  // selección — los items elegidos podrían no estar visibles con el
  // nuevo filtro (la UI mostraría el bulk bar con items huérfanos).
  const onFilterChange = (f: Filter) => {
    setFilter(f);
    setPage(1);
    setSelectedKeys(new Set());
  };
  const onQueryChange = (v: string) => {
    setQuery(v);
    setPage(1);
    setSelectedKeys(new Set());
  };
  // HeroUI pasa `column: Key` — casteamos a nuestro `SortableColumn`
  // restringido. Si no matchea, sort = null.
  const onSortChange = (descriptor: {
    column: Key;
    direction: 'ascending' | 'descending';
  }) => {
    const isValidColumn = (
      ['name', 'role', 'status', 'memberSince'] as const
    ).includes(descriptor.column as SortableColumn);
    setSortDescriptor(
      isValidColumn
        ? {
            column: descriptor.column as SortableColumn,
            direction: descriptor.direction,
          }
        : null,
    );
    setPage(1);
    setSelectedKeys(new Set());
  };

  // Bulk actions solo si sos admin y hay selección.
  const canBulk = currentMember?.role === 'admin';
  const selectedCount =
    selectedKeys === 'all' ? sorted.length : selectedKeys.size;
  const selectedIds =
    selectedKeys === 'all'
      ? sorted.map((m) => m.id)
      : Array.from(selectedKeys).map(String);

  // Una acción bulk se habilita solo si aplica a TODOS los seleccionados
  // (intersección) — nunca se ejecuta sobre alguien para quien no corresponde.
  const bulkAvailable = useMemo(() => {
    if (selectedCount === 0 || !currentMember) {
      return {
        approve: false,
        reject: false,
        suspend: false,
        reactivate: false,
      };
    }
    const ids =
      selectedKeys === 'all'
        ? sorted.map((m) => m.id)
        : Array.from(selectedKeys).map(String);
    const selectedMembers = ids
      .map((id) => members.find((m) => m.id === id))
      .filter((m): m is Member => Boolean(m));
    if (selectedMembers.length === 0) {
      return {
        approve: false,
        reject: false,
        suspend: false,
        reactivate: false,
      };
    }
    const isAdmin = currentMember.role === 'admin';
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
  }, [selectedKeys, sorted, members, currentMember, selectedCount]);

  const anyBulkAvailable =
    bulkAvailable.approve ||
    bulkAvailable.reject ||
    bulkAvailable.suspend ||
    bulkAvailable.reactivate;

  const bulk = (action: 'approve' | 'reject' | 'suspend' | 'reactivate') => {
    if (!currentMember) return;
    selectedIds.forEach((id) => {
      if (action === 'approve') approve(id, currentMember.id);
      else if (action === 'reject')
        reject(id, currentMember.id, 'Rechazado en bulk');
      else if (action === 'suspend')
        suspend(id, currentMember.id, 'Suspendido en bulk');
      else approve(id, currentMember.id);
    });
    setSelectedKeys(new Set());
  };

  // HeroUI v3 Select en single mode pasa la key como string suelto,
  // no un Set. Cuidado: no descartar `value === 'all'` — es un id válido
  // (filter "Todos").
  const filterSelection = useMemo(() => new Set<Filter>([filter]), [filter]);

  // Tipo `(key: Key | null) => void` viene de `AriaSelectProps` de HeroUI.
  const handleFilterSelectionChange = (key: Key | null) => {
    if (key === null) return;
    onFilterChange(key as Filter);
  };

  // CSV con las columnas visibles — consistente con lo que ve el usuario.
  const handleDownloadCsv = () => {
    const rows = sorted.map((m) => ({
      Nombre: m.fullName,
      Email: m.email,
      Rol: m.role,
      Estado: m.accountStatus,
      Zona: m.zone,
      Antigüedad: m.memberSince,
    }));
    const csv = toCsv(rows);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`clublre-socios-${stamp}.csv`, csv);
  };

  // Empty state distinto según "no hay datos" vs "filtro no matcheó".
  const noDataAtAll = members.length === 0;
  const hasActiveQuery = query.trim().length > 0 || filter !== 'all';

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: search izq, filter+download der. En mobile se apila;
          en desktop `ml-auto` empuja el filter al borde derecho. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField
          aria-label="Buscar socio"
          className="w-full sm:w-50"
          value={query}
          onChange={(v) => onQueryChange(v)}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Buscar..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Select
          aria-label="Filtrar por estado"
          className="w-full sm:ml-auto sm:max-w-56"
          placeholder={filterLabel[filter]}
          selectedKey={filterSelection.values().next().value}
          onSelectionChange={handleFilterSelectionChange}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {FILTER_OPTIONS.map((f) => (
                <ListBox.Item key={f} id={f} textValue={filterLabel[f]}>
                  {filterLabel[f]}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Tooltip closeDelay={0} delay={0}>
          <Tooltip.Trigger>
            <IconButton
              aria-label="Descargar como CSV"
              isDisabled={sorted.length === 0}
              onPress={handleDownloadCsv}
            >
              <Download className="size-4" />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Descargar {sorted.length} como CSV</p>
          </Tooltip.Content>
        </Tooltip>
      </div>

      {/* Bulk actions bar — visible solo con selección. Items se habilitan
          según `bulkAvailable` (intersección). */}
      {canBulk && selectedCount > 0 ? (
        <div className="bg-primary/10 text-foreground animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl px-4 py-2 text-sm duration-150 motion-reduce:animate-none">
          <span className="font-medium">
            {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
          </span>
          <Dropdown>
            <Dropdown.Trigger className="button button--sm button--primary gap-1.5 font-semibold">
              <span className="inline-flex items-center gap-1.5">
                Acciones
                <CaretDown aria-hidden="true" className="size-3.5" />
              </span>
            </Dropdown.Trigger>
            <Dropdown.Popover className="w-56" placement="bottom start">
              <Dropdown.Menu aria-label="Acciones en bulk">
                {anyBulkAvailable ? (
                  <>
                    <Dropdown.Item
                      id="approve-bulk"
                      isDisabled={!bulkAvailable.approve}
                      textValue={`Aprobar ${selectedCount}`}
                      onAction={() => bulk('approve')}
                    >
                      <Check
                        aria-hidden="true"
                        className="text-success mr-2 size-4 shrink-0"
                      />
                      <Label>Aprobar {selectedCount}</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="reject-bulk"
                      isDisabled={!bulkAvailable.reject}
                      textValue={`Rechazar ${selectedCount}`}
                      onAction={() => bulk('reject')}
                    >
                      <X
                        aria-hidden="true"
                        className="text-danger mr-2 size-4 shrink-0"
                      />
                      <Label>Rechazar {selectedCount}</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="suspend-bulk"
                      isDisabled={!bulkAvailable.suspend}
                      textValue={`Suspender ${selectedCount}`}
                      onAction={() => bulk('suspend')}
                    >
                      <Pause
                        aria-hidden="true"
                        className="text-warning mr-2 size-4 shrink-0"
                      />
                      <Label>Suspender {selectedCount}</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="reactivate-bulk"
                      isDisabled={!bulkAvailable.reactivate}
                      textValue={`Reactivar ${selectedCount}`}
                      onAction={() => bulk('reactivate')}
                    >
                      <Play
                        aria-hidden="true"
                        className="text-primary mr-2 size-4 shrink-0"
                      />
                      <Label>Reactivar {selectedCount}</Label>
                    </Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item
                    isDisabled
                    id="no-bulk-actions"
                    textValue="Sin acciones disponibles"
                  >
                    <Label className="text-default-500">
                      Sin acciones disponibles
                    </Label>
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
          <Button
            className="text-default-600 ml-auto font-semibold"
            size="sm"
            variant="ghost"
            onPress={() => setSelectedKeys(new Set())}
          >
            Limpiar selección
          </Button>
        </div>
      ) : null}

      <Table aria-label="Lista de socios" className="h-100">
        <Table.ScrollContainer>
          <Table.Content
            className="min-h-90 min-w-190"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor ?? undefined}
            onSelectionChange={(keys) => {
              setSelectedKeys(keys as Selection);
              setPage(1);
            }}
            onSortChange={onSortChange}
          >
            <Table.Header className="bg-surface-secondary sticky top-0 z-10">
              <Table.Column className="text-default-600 w-10 font-semibold tracking-wider uppercase">
                <Checkbox aria-label="Seleccionar todos" slot="selection">
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox.Content>
                </Checkbox>
              </Table.Column>
              <Table.Column
                allowsSorting
                isRowHeader
                className="text-default-600 font-semibold tracking-wider uppercase"
                id="name"
              >
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Nombre
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column
                allowsSorting
                className="text-default-600 font-semibold tracking-wider uppercase"
                id="role"
              >
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Rol
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column
                allowsSorting
                className="text-default-600 font-semibold tracking-wider uppercase"
                id="status"
              >
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Estado
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column
                allowsSorting
                className="text-default-600 font-semibold tracking-wider uppercase"
                id="memberSince"
              >
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Antigüedad
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column className="text-default-600 bg-surface-secondary sticky right-0 z-10 w-20 text-center font-semibold tracking-wider uppercase">
                <Gear aria-hidden="true" className="mx-auto size-4" />
                <span className="sr-only">Acciones</span>
              </Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <EmptyState className="text-default-500 flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                  {noDataAtAll ? (
                    <>
                      <div className="bg-primary/10 text-primary inline-flex items-center justify-center rounded-2xl p-3">
                        <Users aria-hidden="true" className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-sm font-semibold">
                          Todavía no hay socios registrados
                        </p>
                        <p className="text-default-500 text-xs">
                          Las solicitudes de alta aparecerán acá para que la
                          comisión las apruebe.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-primary/10 text-primary inline-flex items-center justify-center rounded-2xl p-3">
                        <MagnifyingGlass
                          aria-hidden="true"
                          className="size-6"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-sm font-semibold">
                          No encontramos coincidencias
                        </p>
                        <p className="text-default-500 text-xs">
                          {hasActiveQuery
                            ? 'Probá limpiar el filtro o ajustar la búsqueda.'
                            : 'No hay socios en este estado.'}
                        </p>
                      </div>
                      {hasActiveQuery ? (
                        <Button
                          className="mt-1 inline-flex items-center gap-1.5 font-semibold"
                          size="sm"
                          variant="outline"
                          onPress={() => {
                            setQuery('');
                            setFilter('all');
                            setPage(1);
                          }}
                        >
                          <FunnelX
                            aria-hidden="true"
                            className="text-default-500 size-4 shrink-0"
                          />
                          Limpiar filtros
                        </Button>
                      ) : null}
                    </>
                  )}
                </EmptyState>
              )}
            >
              {paginated.map((m) => (
                <Table.Row key={m.id} id={m.id}>
                  <Table.Cell>
                    <Checkbox
                      aria-label={`Seleccionar ${m.fullName}`}
                      slot="selection"
                      variant="secondary"
                    >
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                    </Checkbox>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <Avatar.Fallback
                          className="bg-primary/15 text-primary font-semibold"
                          delayMs={0}
                        >
                          {getInitials(m.fullName)}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {m.fullName} {m.lastInitial}.
                        </span>
                        <span className="text-default-500 truncate text-xs">
                          {m.email}
                        </span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <RoleBadge role={m.role} />
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={m.accountStatus} />
                  </Table.Cell>
                  <Table.Cell className="text-default-600 text-xs">
                    {formatDate(m.memberSince)}
                  </Table.Cell>
                  <Table.Cell className="bg-surface sticky right-0 z-10 w-20">
                    <div className="flex justify-center">
                      <Dropdown>
                        <Dropdown.Trigger
                          aria-label="Acciones del socio"
                          className="text-default-600 hover:bg-foreground/10 hover:text-foreground data-[disabled=true]:text-default-300 inline-flex size-8 items-center justify-center rounded-md transition-colors data-[disabled=true]:hover:bg-transparent data-[pressed=true]:scale-95"
                          isDisabled={!hasActions(m, currentMember)}
                        >
                          <DotsVertical className="size-4" />
                        </Dropdown.Trigger>
                        <Dropdown.Popover
                          className="w-44"
                          placement="bottom end"
                        >
                          <Dropdown.Menu aria-label="Acciones">
                            {m.accountStatus === 'pending' && (
                              <>
                                <Dropdown.Item
                                  id="approve"
                                  textValue="Aprobar"
                                  onAction={() =>
                                    currentMember &&
                                    approve(m.id, currentMember.id)
                                  }
                                >
                                  <Check
                                    aria-hidden="true"
                                    className="text-success mr-2 size-4 shrink-0"
                                  />
                                  <Label>Aprobar</Label>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  id="reject"
                                  textValue="Rechazar"
                                  onAction={() =>
                                    currentMember &&
                                    reject(m.id, currentMember.id, 'Sin padrón')
                                  }
                                >
                                  <X
                                    aria-hidden="true"
                                    className="text-danger mr-2 size-4 shrink-0"
                                  />
                                  <Label>Rechazar</Label>
                                </Dropdown.Item>
                              </>
                            )}
                            {m.accountStatus === 'active' &&
                              !isAdminRole(m) &&
                              currentMember?.role === 'admin' && (
                                <Dropdown.Item
                                  id="suspend"
                                  textValue="Suspender"
                                  onAction={() =>
                                    currentMember &&
                                    suspend(
                                      m.id,
                                      currentMember.id,
                                      'Suspendido',
                                    )
                                  }
                                >
                                  <Pause
                                    aria-hidden="true"
                                    className="text-warning mr-2 size-4 shrink-0"
                                  />
                                  <Label>Suspender</Label>
                                </Dropdown.Item>
                              )}
                            {m.accountStatus === 'suspended' && (
                              <Dropdown.Item
                                id="reactivate"
                                textValue="Reactivar"
                                onAction={() =>
                                  currentMember &&
                                  approve(m.id, currentMember.id)
                                }
                              >
                                <Play
                                  aria-hidden="true"
                                  className="text-primary mr-2 size-4 shrink-0"
                                />
                                <Label>Reactivar</Label>
                              </Dropdown.Item>
                            )}
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {/* Pagination — custom styling copiado del patrón HeroUI v3 (pill
          container con accent activo). Pagination a la izquierda,
          results count a la derecha (Summary built-in). */}
      <div className="flex items-center justify-between gap-4">
        <Pagination className="justify-start">
          <Pagination.Content className="bg-surface-secondary shadow-club gap-1 rounded-xl p-1">
            <Pagination.Item>
              <Pagination.Previous
                className="text-default-600 hover:bg-surface hover:text-foreground data-[disabled=true]:text-default-300 data-[disabled=true]:hover:bg-transparent"
                isDisabled={safePage === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              >
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Pagination.Item key={p}>
                <Pagination.Link
                  className={
                    p === safePage
                      ? 'bg-primary text-primary-foreground hover:bg-primary'
                      : 'text-default-600 hover:bg-surface hover:text-foreground'
                  }
                  isActive={p === safePage}
                  onPress={() => setPage(p)}
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next
                className="text-default-600 hover:bg-surface hover:text-foreground data-[disabled=true]:text-default-300 data-[disabled=true]:hover:bg-transparent"
                isDisabled={safePage === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>

        <Pagination className="justify-end">
          <Pagination.Summary className="text-default-500 text-xs whitespace-nowrap">
            {totalPages > 1
              ? (() => {
                  const first = (safePage - 1) * ROWS_PER_PAGE + 1;
                  const last = Math.min(
                    safePage * ROWS_PER_PAGE,
                    sorted.length,
                  );
                  return `${first}–${last} de ${sorted.length} resultados`;
                })()
              : `${sorted.length} resultado${sorted.length !== 1 ? 's' : ''}`}
          </Pagination.Summary>
        </Pagination>
      </div>
    </div>
  );
}
