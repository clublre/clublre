import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google';

// CSS variables expuestas por Next/font — las declaramos explícitas
// para que el `@theme` de Tailwind pueda referenciarlas por nombre.
//
// display: 'swap'  → el browser usa fallback font hasta que Inter carga,
//                    evita CLS por font swap
// preload: true   → Next inyecta <link rel="preload" as="font"> en el head
export const fontSans = FontSans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  display: 'swap',
  preload: false, // mono no se usa en above-the-fold
  variable: '--font-fira-code',
});
