import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google';

/**
 * Source CSS variables exposed by Next/font. We declare them
 * explicitly so Tailwind's `@theme` block can reference them by name
 * (otherwise Tailwind falls back to its built-in stack and our font
 * never reaches the page).
 */
export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-fira-code',
});
