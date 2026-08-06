# Supabase — DB + Auth + Storage

Carpeta preparada para las migrations de Supabase cuando se cree el proyecto en [supabase.com](https://supabase.com/dashboard) (región **sa-east-1** — São Paulo).

## Estructura esperada

```
supabase/
├── README.md            # este archivo
├── migrations/           # SQL versionado (crear con `supabase init`)
│   └── 0001_init.sql     # schema inicial + RLS policies
├── seed.sql              # datos iniciales (catálogo, admin seed)
└── config.toml           # config local de `supabase start`
```

## Cómo se va a usar

```bash
# Instalar CLI (una vez)
brew install supabase/tap/supabase

# Inicializar (crea migrations/ vacía y config.toml)
supabase init

# Vincular al proyecto del club
supabase link --project-ref <ref>

# Crear nueva migration
supabase migration new add_listing_images_table

# Aplicar migrations al remoto
supabase db push

# Levantar entorno local (Postgres + Auth + Storage)
supabase start
```

## Schema previsto (resumen)

| Tabla            | Propósito                         |
| ---------------- | --------------------------------- |
| `members`        | Socios + roles + estado de cuenta |
| `listings`       | Publicaciones del marketplace     |
| `listing_images` | Imágenes de cada listing          |
| `categories`     | Categorías del marketplace        |
| `reports`        | Reportes de publicaciones         |
| `audit_log`      | Log append-only (acciones admin)  |
| `posts`          | Blog                              |

**RLS en TODAS las tablas** — defense in depth. Ver STACK.md §6.

## Storage buckets

- `avatars` — privado (cada socio lee solo el suyo, admin lee todos)
- `listings` — público lectura, owner escritura
- `blog` — público lectura, admin/mod escritura

Ver detalle en STACK.md §2.3.

## Estado actual

⏸ **Pendiente** — se arranca cuando el club provea:

- Acceso al dashboard de Supabase (o crear el proyecto)
- Decisión sobre email/password auth vs magic link vs ambos
- Confirmación del dominio `clublre.com.ar` para emails transaccionales
