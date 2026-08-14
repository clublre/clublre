// Feature flag de la maqueta. Mientras Supabase no esté conectado,
// todo el demo de auth + admin + marketplace funciona con seeds y
// stores del cliente. Cuando se enchufe Supabase real:
//   1. NEXT_PUBLIC_MAQUETA=false (o ausente)
//   2. /admin/* devuelve notFound()
//   3. signInAs() devuelve error
//
// Centralizar acá evita que cada componente pregunte por la env var
// por su cuenta (y queda un solo punto para cambiar el comportamiento).

export function isMaqueta(): boolean {
  // `NEXT_PUBLIC_` = visible en el bundle. Default `true` mientras
  // Supabase no esté enchufado.
  const flag = process.env['NEXT_PUBLIC_MAQUETA'];
  if (flag === undefined) return true;
  return flag === 'true' || flag === '1';
}
