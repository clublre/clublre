'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@heroui/react';

import { useCurrentMember } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { getBreadcrumbs } from '@/lib/breadcrumbs';

/**
 * Breadcrumb crumb-by-crumb. Sólo se muestra para usuarios logueados
 * en páginas internas (no en home, about, blog index, marketplace index).
 *
 * Rendering usando HeroUI v3 `<Breadcrumbs>` con la variante "soft"
 * del repo: pill con `bg-default-soft`, sticky bajo el navbar, sin
 * border-b. Cada item es un link excepto el último (current).
 */
export function Breadcrumb() {
  const pathname = usePathname();
  const member = useCurrentMember();
  const mounted = useHasMounted();

  if (!mounted) return null;
  if (!member) return null;

  // En admin el AdminShell ya muestra la sección activa — breadcrumb redundante
  // cuando el usuario tiene la nav bar sticky justo arriba del contenido.
  if (pathname.startsWith('/admin')) return null;

  const items = getBreadcrumbs(pathname, member.role);
  if (items.length === 0) return null;

  return (
    <div className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-16 z-30 px-6 py-3 backdrop-blur-xl">
      <Breadcrumbs className="bg-default-soft rounded-lg px-3 py-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const className = isLast
            ? 'font-medium text-foreground'
            : 'text-muted hover:text-accent';
          return (
            <Breadcrumbs.Item
              key={`${item.label}-${i}`}
              className={className}
              {...(item.href ? { href: item.href } : {})}
            >
              {item.label}
            </Breadcrumbs.Item>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
