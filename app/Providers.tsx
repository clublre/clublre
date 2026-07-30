'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// HeroUI v3 no necesita Provider (a diferencia de NextUI v2).
// Solo wrapeamos con next-themes para manejar light/dark.
// HeroUI lee el tema activo de `data-theme` automáticamente.
export function Providers({ children, themeProps }: ProvidersProps) {
  return <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>;
}
