'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button } from '@heroui/react';

import { useCurrentMember } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { Plus } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

// Floating "Publicar" — solo socios logueados active. Desktop aparece tras
// scrollear 30% (no compite con filtros arriba). Mobile siempre visible.
export function StickyPublishButton() {
  const member = useCurrentMember();
  const mounted = useHasMounted();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      // Aparece tras scrollear ~30% del viewport inicial.
      const threshold = window.innerHeight * 0.3;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mounted]);

  // Pre-mount: no renderizar (placeholder idéntico server/cliente).
  if (!mounted) return null;
  // Solo socios activos pueden publicar.
  if (!member || member.accountStatus !== 'active') return null;

  return (
    <div
      className={cn(
        // Fixed bottom-right, debajo del BackToTop si ambos están visibles.
        'fixed right-4 bottom-16 z-30 transition-all duration-300 motion-reduce:transition-none sm:bottom-4',
        // Mobile siempre visible; desktop aparece tras scrollear.
        scrolled
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0 max-sm:translate-y-0 max-sm:opacity-100',
      )}
    >
      <NextLink
        aria-label="Publicar en Entre Socios"
        className="block"
        href={routes.marketplaceNew}
      >
        <Button
          className="shadow-club-lg font-semibold"
          size="md"
          variant="primary"
        >
          <Plus aria-hidden="true" className="size-4" />
          Publicar
        </Button>
      </NextLink>
    </div>
  );
}
