'use client';

import * as React from 'react';
import { addCollection } from '@iconify/react';
import { icons as phIcons } from '@iconify-json/ph';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// HeroUI v3 no necesita Provider (a diferencia de NextUI v2).
// Solo wrapeamos con next-themes; HeroUI lee el tema de `data-theme`.
//
// Collection de phosphor offline — sin esto, `<Icon icon="ph:house" />`
// hace fetch a api.iconify.design en runtime y los icons no se ven en
// prod (el sandbox de Vercel no sale a internet antes de hidratar).
addCollection(phIcons);

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NuqsAdapter>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </NuqsAdapter>
  );
}
