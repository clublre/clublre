'use client';

import { create } from 'zustand';

// UI store — estado de UI cross-route, solo client. El theme toggle
// sigue en `next-themes` (maneja SSR safety, FOUC y persistencia que
// reimplementaríamos mal). Acá viven bits de UI que múltiples
// componentes coordinan o que se disparan desde shortcuts / command
// palettes.
//
// Agregar nuevos slices como propiedades planas (no objetos anidados)
// para mantener baratas las subscriptions.
//
// NUNCA meter acá server data ni nada que deba sobrevivir un hard
// reload — para eso usar server cache (RSC, fetch cache) o cookies.

export interface UiState {
  // Mobile menu — movido desde el `useState` local de `<Navbar>` para
  // que cambios de ruta, el badge "Activa" y futuros shortcuts (ej.
  // ⌘K) puedan abrir/cerrar el drawer desde fuera del Navbar.
  mobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
}));
