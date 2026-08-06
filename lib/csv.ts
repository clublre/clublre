// Helpers para exportar data a CSV — pensado para descargar tablas
// desde el panel admin (Socios, Publicaciones, Reportes). Mantenerlo
// en `lib/` para reuso entre páginas.

// Escapa un valor CSV según RFC 4180. Si contiene coma, comilla
// o salto de línea, lo envuelve en comillas dobles y escapa las
// comillas internas.
const escapeCsv = (v: unknown): string => {
  const s = v === null || v === undefined ? '' : String(v);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

/** Convierte un array de objetos a CSV. La primera fila son los
 *  headers derivados de las keys. Devuelve el string con terminador
 *  CRLF (compatible con Excel y Google Sheets). */
export const toCsv = <T extends Record<string, unknown>>(
  rows: ReadonlyArray<T>,
  columns?: ReadonlyArray<keyof T>,
): string => {
  if (rows.length === 0) return '';
  const cols =
    columns ?? (Object.keys(rows[0] as object) as ReadonlyArray<keyof T>);
  const header = cols.map((c) => escapeCsv(String(c))).join(',');
  const body = rows
    .map((row) => cols.map((c) => escapeCsv(row[c])).join(','))
    .join('\r\n');
  return `${header}\r\n${body}\r\n`;
};

/** Dispara una descarga de CSV en el navegador. Crea un Blob, genera
 *  una URL temporal y la "clickea" programáticamente. La URL se
 *  libera después para no leakear memoria. */
export const downloadCsv = (filename: string, csv: string): void => {
  if (typeof window === 'undefined') return;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
