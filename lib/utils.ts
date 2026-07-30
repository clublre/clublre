import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** `cn` — helper de merge de clases Tailwind. Combina `clsx`
 *  (clases condicionales) con `twMerge` (deduplica utilities
 *  que conflictúan, gana la última). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
