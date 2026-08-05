'use client';

import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button } from '@heroui/react';

import { useCurrentMember } from '@/stores/auth-store';
import { useHasMounted } from '@/lib/auth-helpers';
import { Plus } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

/**
 * Floating "Publicar" button — visible solo para socios logueados en
 * la página de Marketplace. En desktop aparece fixed bottom-right cuando
 * el usuario scrolleó más de 30% (así no compite con los filtros arriba).
 * En mobile siempre visible.
 *
 * No se monta si el usuario no tiene sesión (login) o si no es `active`.
 */
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

  // After mount, server and client render the same placeholder.
  if (!mounted) return null;
  // Sólo socios activos pueden publicar.
  if (!member || member.accountStatus !== 'active') return null;

  return (
    <div
      className={cn(
        // Fixed bottom-right, debajo del BackToTop cuando ambos están.
        'fixed right-4 bottom-16 z-30 transition-all duration-300 motion-reduce:transition-none sm:bottom-4',
        // En mobile: siempre visible. En desktop: aparece tras scrollear.
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
