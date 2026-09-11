'use client';

// Dropdown del socio logueado — slot derecho de la navbar.
// Patrón HeroUI v3: trigger avatar + header (avatar+email) + items con icono.
// Chip de rol en fila propia, no mezclado con el avatar.

import { Avatar, Chip, Dropdown, Label } from '@heroui/react';

import { logout } from '@/app/actions/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useResolvedMember } from '@/lib/auth-helpers';
import { routes } from '@/lib/routes';
import { Gear, Plus, SignIn, SignOut, User } from '@/components/ui/Icons';
import type { Member, Role } from '@/data/marketplace';

const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase();
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
};

const ROLE_CHIP: Record<
  Role,
  {
    label: string;
    color: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  }
> = {
  member: { label: 'Socio', color: 'default' },
  moderator: { label: 'Moderador', color: 'accent' },
  admin: { label: 'Administrador', color: 'accent' },
};

// `supabaseMember` viene del layout (cookie). Si es null, cae al mock.
export function UserMenu({
  supabaseMember,
}: {
  supabaseMember?: Member | null;
}) {
  const member = useResolvedMember(supabaseMember);
  const signOutMock = useAuthStore((s) => s.signOut);

  if (!member) return null;

  // Cookie + localStorage — ver logout en app/actions/auth.ts.
  const onSignOut = () => {
    signOutMock();
    void logout();
  };

  const initialsLabel = initials(member.fullName);
  const roleChip = ROLE_CHIP[member.role];

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={`Menú de ${member.fullName}`}
        className="hover:bg-foreground/10 rounded-full transition-transform data-pressed:scale-95"
      >
        <Avatar className="cursor-pointer" size="sm">
          {/* Sin `src` en la maqueta — `Fallback` siempre renderiza. */}
          <Avatar.Fallback
            className="bg-primary/15 text-primary font-semibold"
            delayMs={0}
          >
            {initialsLabel}
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover className="w-64 rounded-md!">
        {/* Header: avatar + nombre + email. NO es un Menu.Item. */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <Avatar size="sm">
            <Avatar.Fallback
              className="bg-primary/15 text-primary font-semibold"
              delayMs={0}
            >
              {initialsLabel}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <p className="text-foreground truncate text-sm leading-5 font-semibold">
              {member.fullName}
            </p>
            <p className="text-default-500 truncate text-xs leading-none">
              {member.email}
            </p>
          </div>
        </div>

        {/* Chip de rol — debajo del bloque user, en su propia fila. */}
        <div className="px-4 pb-3">
          <Chip
            color="accent"
            size="sm"
            variant="soft"
          >
            {roleChip.label}
          </Chip>
        </div>

        <Dropdown.Menu
          aria-label="Acciones de cuenta"
          className="pb-4"
          onAction={(key) => {
            if (key === 'sign-out') onSignOut();
          }}
        >
          <Dropdown.Item
            href={routes.account}
            id="cuenta"
            textValue="Mi cuenta"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Mi cuenta</Label>
              <User className="text-foreground size-4" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            href={routes.marketplaceNew}
            id="publicar"
            textValue="Publicar"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Publicar</Label>
              <Plus className="text-foreground size-4" />
            </div>
          </Dropdown.Item>
          {(member.role === 'admin' || member.role === 'moderator') && (
            <Dropdown.Item
              href={routes.admin}
              id="admin"
              textValue="Administración"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Administración</Label>
                <Gear className="text-foreground size-4" />
              </div>
            </Dropdown.Item>
          )}
          <Dropdown.Item
            id="sign-out"
            textValue="Cerrar sesión"
            variant="danger"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Cerrar sesión</Label>
              <SignOut className="text-danger size-4" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

// Trigger avatar sin sesión — ofrece login + registro.
export function SignInTrigger() {
  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Iniciar sesión"
        className="hover:bg-foreground/10 rounded-full transition-transform data-pressed:scale-95"
      >
        <Avatar className="cursor-pointer" size="sm">
          <Avatar.Fallback
            className="bg-primary/15 text-primary font-semibold"
            delayMs={0}
          >
            <User className="size-4" />
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover className="w-56">
        <Dropdown.Menu aria-label="Acciones de cuenta">
          <Dropdown.Item
            href={routes.login}
            id="login"
            textValue="Iniciar sesión"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Iniciar sesión</Label>
              <SignIn className="text-foreground size-4" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            href={routes.registro}
            id="registro"
            textValue="Registrarme"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Registrarme</Label>
              <Plus className="text-foreground size-4" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
