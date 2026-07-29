"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

/**
 * HeroUI v3 doesn't require a Provider (unlike NextUI v2).
 * We only wrap with next-themes to drive light/dark mode.
 * HeroUI reads the active theme from `data-theme` automatically
 * when paired with `next-themes`.
 */
export function Providers({ children, themeProps }: ProvidersProps) {
  return <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>;
}
