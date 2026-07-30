import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google';

// CSS variables expuestas por Next/font — las declaramos explícitas
// para que el `@theme` de Tailwind pueda referenciarlas por nombre.
export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-fira-code',
});
