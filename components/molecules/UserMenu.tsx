'use client';

// UserMenu — dropdown para socios logueados. Slot derecho de la
// navbar cuando hay sesión. Combina `Dropdown` de HeroUI v3 con
// el estado del store de auth.

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Dropdown, Label } from '@heroui/react';

import { useAuthStore, useCurrentMember } from '@/stores/auth-store';
import { routes } from '@/lib/routes';
import { RoleBadge } from '@/components/atoms/StatusBadge';

const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase();
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
};

/** Menú de usuario — visible cuando hay sesión activa. */
export function UserMenu() {
  const member = useCurrentMember();
  const signOut = useAuthStore((s) => s.signOut);
  const router = useRouter();

  if (!member) return null;

  const onSignOut = () => {
    signOut();
    router.push(routes.home);
  };

  return (
    <Dropdown>
      <Button
        aria-label={`Menú de ${member.fullName}`}
        className="hover:bg-foreground/10 px-2"
        size="md"
        variant="ghost"
      >
        <span
          aria-hidden="true"
          className="bg-primary/10 text-primary inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold"
        >
          {initials(member.fullName)}
        </span>
        <span className="ml-2 hidden text-sm font-medium sm:inline">
          {member.fullName.split(' ')[0]}
        </span>
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => {
            if (key === 'sign-out') onSignOut();
          }}
        >
          <Dropdown.Item id="profile" textValue="profile">
            <div className="flex flex-col gap-0.5 py-1">
              <Label className="font-semibold">{member.fullName}</Label>
              <span className="text-default-500 text-xs">{member.email}</span>
              <span className="mt-1">
                <RoleBadge role={member.role} />
              </span>
            </div>
          </Dropdown.Item>
          <Dropdown.Item href={routes.account} id="cuenta">
            Mi cuenta
          </Dropdown.Item>
          <Dropdown.Item href={routes.marketplaceNew} id="publicar">
            Publicar
          </Dropdown.Item>
          {(member.role === 'admin' || member.role === 'moderator') && (
            <Dropdown.Item href={routes.admin} id="admin">
              Administración
            </Dropdown.Item>
          )}
          <Dropdown.Item id="sign-out" textValue="sign-out" variant="danger">
            Cerrar sesión
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

/** Trigger link al login — slot derecho de la navbar cuando NO hay sesión. */
export function SignInTrigger() {
  return (
    <NextLink
      className="hover:bg-foreground/10 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
      href={routes.login}
    >
      Ingresar
    </NextLink>
  );
}
