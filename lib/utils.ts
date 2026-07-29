import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — Tailwind class-name merge helper.
 *
 * Combines `clsx` (conditional classes) with `twMerge` (deduplicates
 * conflicting Tailwind utilities, later class wins).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
