'use client';

import { create } from 'zustand';

/**
 * UI store — cross-route, client-only UI state.
 *
 * The theme toggle intentionally stays on `next-themes` (it
 * handles SSR safety, FOUC prevention and persistence that we'd
 * otherwise reimplement poorly). This store is for the other
 * kind of state: bits of UI that multiple components need to
 * coordinate, or that we want to drive programmatically from
 * keyboard shortcuts / command palettes.
 *
 * Add new slices here as plain properties, not nested objects,
 * so React subscriptions stay cheap (selectors can pluck a
 * single key with `useUiStore((s) => s.foo)` and avoid
 * re-renders on unrelated changes).
 *
 * NEVER put server data, fetched content, or anything that
 * must survive a hard reload in this store — use a server
 * cache (RSC, fetch cache) or cookies for that.
 */
export interface UiState {
  // Mobile menu — moved here from <Navbar>'s local useState so
  // that route changes, the "Activa" badge, and any future
  // keyboard shortcut (e.g. ⌘K) can open/close it from outside
  // the Navbar component.
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
