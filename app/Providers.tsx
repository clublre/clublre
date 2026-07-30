'use client';

import * as React from 'react';
import { addCollection } from '@iconify/react';
import { icons as phIcons } from '@iconify-json/ph';
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
//
// Registramos la collection de phosphor offline — sin esto,
// `<Icon icon="ph:house" />` hace fetch a api.iconify.design en
// runtime y los icons no se ven en prod (el sandbox de Vercel no
// sale a la API antes de hidratar).
addCollection(phIcons);

export function Providers({ children, themeProps }: ProvidersProps) {
  return <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>;
}
