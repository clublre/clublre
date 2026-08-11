import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** `cn` — helper de merge de clases Tailwind. Combina `clsx`
 *  (clases condicionales) con `twMerge` (deduplica utilities
 *  que conflictúan, gana la última). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** `yearsSince` — años completos transcurridos desde `year` hasta hoy.
 *  Pensado para "años de historia" / "años formando comunidad" que se
 *  actualizan solos cuando el server renderiza. Usa el huso horario
 *  del server (UTC por default en Vercel) — si necesitás precisión a
 *  día exacto, pasá `new Date(year, 11, 31)` o similar al caller. */
export function yearsSince(year: number): number {
  return new Date().getFullYear() - year;
}

/** `decadesSince` — décadas completas transcurridas desde `year` hasta hoy.
 *  Mismo contrato que `yearsSince` pero redondea a décadas (Math.floor).
 *  Sirve para copy tipo "ocho décadas" que se desactualiza solo. */
export function decadesSince(year: number): number {
  return Math.floor(yearsSince(year) / 10);
}
