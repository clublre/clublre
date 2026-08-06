# Migrations de Supabase

Carpeta para las migrations SQL versionadas. Se crean con `supabase migration new <nombre>` (ver `../README.md` para setup).

## Convención de nombres

```sql
0001_init.sql                    -- schema inicial + RLS
0002_add_listing_images.sql      -- una migration por cambio
0003_seed_categories.sql         -- seeds idempotentes
```

## Antes de mergear una migration

- [ ] Probada localmente con `supabase db reset`
- [ ] RLS policies incluidas si crea tabla nueva
- [ ] Reversible (o documentada en el PR si no lo es)
- [ ] Sin datos hardcoded — usar seed aparte

## Estado

⏸ Vacía — se pobla al arrancar la Semana 1 del roadmap (STACK.md §8).
