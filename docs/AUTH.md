# Auth con Supabase — guía para el equipo

Documento de la integración inicial de registro/login. La maqueta
(Zustand + atajos “Como admin”) **sigue viva** en paralelo.

Para el mapa de clientes ver también `lib/supabase/README.md`.
Para el plan de stack completo ver `STACK.md`.

---

## Idea central

Hay **dos capas** de “usuario”:

| Capa      | Dónde                        | Para qué                                                                     |
| --------- | ---------------------------- | ---------------------------------------------------------------------------- |
| **Auth**  | `auth.users` (Supabase Auth) | ¿Puede entrar? Email + password + cookie httpOnly                            |
| **Socio** | `public.members`             | ¿Es socio aprobado? `pending` / `active` / `suspended` / `rejected` + `role` |

Un user puede loguearse y quedar en **pending** (`/cuenta/estado`).
Solo con `account_status = 'active'` entra a `/cuenta` plena.

Además coexisten **dos sesiones** (transición):

- **Supabase** (cookie) → registro / login reales
- **Mock Zustand** (`localStorage`) → botones “Como socio / moderador / admin” y marketplace demo

`useResolvedMember` (`lib/auth-helpers.ts`): si hay socio de cookie, gana;
si no, el mock. Así no rompemos la demo mientras migramos.

---

## Configuración (fuera del código)

### Variables de entorno

| Variable                            | ¿Obligatoria hoy?   | Notas                                                                  |
| ----------------------------------- | ------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`          | Sí                  | Project URL                                                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Sí                  | Publishable / anon key                                                 |
| `NEXT_PUBLIC_DEPLOY_BRANCH=develop` | Sí en local/preview | Muestra login en la navbar (pendiente de revisar con el equipo)        |
| `NEXT_PUBLIC_MAQUETA`               | Sí según entorno    | `true` = atajos demo en `/login` + admin stub. **Production: `false`** |
| `NEXT_PUBLIC_APP_URL`               | Recomendada         | `http://localhost:3000` en local                                       |
| `SUPABASE_SERVICE_ROLE_KEY`         | No                  | Bypasea RLS; no hay `admin.ts` cableado aún                            |
| Resend / Turnstile                  | No                  | Próximas features                                                      |

Local: `.env.local` (gitignored). Vercel: Project → Environment Variables.

**Maqueta vs auth real en `/login`:** con `NEXT_PUBLIC_MAQUETA=true` se
ven Google fake y “Como socio/admin”. Con `false`, solo email+password
contra Supabase. La navbar sigue gated por `DEPLOY_BRANCH` hasta
acordar el cambio con el equipo.

### Dashboard Supabase

1. Correr en el **SQL Editor** (en orden):
   - `supabase/migrations/0001_members.sql` (tabla + RLS)
   - `supabase/migrations/0002_handle_new_user.sql` (trigger: Auth → members)
2. Authentication → Email: on. **Confirm email: off** en local
   (con el trigger, la ficha se crea igual; sin confirm, `signUp` deja sesión
   y el redirect a `/cuenta/estado` funciona).
3. URL Configuration → Site URL: `http://localhost:3000` (+ redirects).

### Activar un socio (mientras no hay UI admin)

En Table Editor → `members`, o:

```sql
update public.members
set account_status = 'active'
where email = 'socio@ejemplo.com';
```

El status **no** está en Authentication → Users; solo en `members.account_status`.

---

## Mapa de archivos

```
lib/supabase/
  env.ts           # Lee URL + anon; null si faltan (sitio no se cae)
  server.ts        # Cliente RSC / Server Actions (cookies)
  client.ts        # Cliente browser (OAuth / Realtime después)
  member.ts        # snake_case DB → Member camelCase
  get-member.ts    # getUser() + select members — "quién soy" en server

proxy.ts           # Next 16: refresca cookie Auth en cada request

app/actions/auth.ts
  register / login / logout

components/pages/auth/
  ApplicationForm  # /registro → register
  LoginForm        # email+password → login; Google + atajos = mock

app/cuenta/page.tsx              # Server: lee cookie, pasa prop
components/pages/account/
  AccountScreen.tsx              # UI; useResolvedMember
  AccountStatusScreen.tsx        # pending / rejected / suspended

supabase/migrations/0001_members.sql         # schema + RLS
supabase/migrations/0002_handle_new_user.sql # trigger Auth → members
```

---

## Flujos

```
/registro → signUp(metadata) → trigger crea members(pending) → /cuenta/estado
                              ↓ (activar en DB)
/login (email+pass) → login → /cuenta
Cerrar sesión → logout (cookie) + signOut mock → home
```

**Alta atómica:** la app **no** inserta en `members`. El trigger
`on_auth_user_created` (`0002_handle_new_user.sql`) corre en la misma
transacción que el insert a `auth.users`. Si la ficha falla, falla todo
el signup. Nombre/zona/nota viajan en `options.data` del `signUp`.

Atajos “Como admin” = solo mock; **no** escriben en Supabase.

---

## Por qué `page.tsx` de cuenta es tan chico

`getCurrentMember()` usa cookies → solo corre en el **servidor**.
La UI usa hooks (`useState`, Zustand) → necesita `'use client'`.

Patrón: Server Component pide el socio → Client Component pinta y
resuelve mock si no hay cookie. Ver `docs` mental: view + template.

---

## Qué NO está (todavía)

- Google OAuth real
- Aprobar socios desde `/admin` (sigue mock)
- Marketplace / listings en Postgres
- Cliente `admin.ts` (service role)
- Resend / Turnstile / confirmación de email en prod

---

## Cómo probar en local

```bash
nvm use
pnpm install
pnpm dev
```

1. `/registro` con email nuevo → fila en Auth + Table Editor `members`.
2. Activar con SQL / Table Editor.
3. Logout → `/login` email+password → `/cuenta`.
4. Atajo “Como admin” sigue andando para marketplace demo
   (solo si `NEXT_PUBLIC_MAQUETA=true`).

---

## Checklist v1 — salir a producción

Primera versión productiva = **registro + login email/password** reales.
El código de auth ya está; esto es lo que falta **antes** de usuarios reales.

### Pendientes

- [ ] **Vercel Production — env vars**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_APP_URL` = dominio real (ej. `https://clublre.com.ar`)
  - `NEXT_PUBLIC_MAQUETA=false`
  - Redeploy después de guardar las vars

- [ ] **Supabase — Auth URL Configuration**
  - Site URL = dominio de producción
  - Redirect URLs = dominio + `/**` (y previews `*.vercel.app` si aplica)

- [ ] **Supabase — schema**
  - Correr `0001_members.sql` y `0002_handle_new_user.sql` en prod
    (si es otro proyecto que el de local), en ese orden

- [ ] **Confirm email**
  - v1: dejar **Confirm email OFF** (mismo flujo que local; sesión inmediata
    tras el registro). Con el trigger, la ficha se crea igual si se prende.

- [ ] **Navbar / `NEXT_PUBLIC_DEPLOY_BRANCH`**
  - Hoy el login en la barra solo se muestra si
    `NEXT_PUBLIC_DEPLOY_BRANCH=develop`
  - Acordar con el equipo cómo mostrarlo en Production (se puede cambiar y utilizar directamente la feature flag NEXT_PUBLIC_MAQUETA)

- [ ] **Activar socios - Comisión**
  - Sin UI admin todavía. Activar a mano:

```sql
update public.members
set account_status = 'active'
where email = 'socio@ejemplo.com';
```

- Opcional: también `role = 'admin' | 'moderator'` si corresponde

- [ ] **Smoke test en el deploy**
  - Registro → fila en Auth + `members` (pending)
  - Activar socio
  - Login → `/cuenta`
  - Logout → login otra vez
  - Con `MAQUETA=false`: `/login` sin Google fake ni atajos de rol

### Muy recomendable (v1.1)

- [ ] Olvidé mi contraseña (`resetPasswordForEmail` + páginas UI + SMTP)
- [ ] CSP `connect-src` incluye `https://*.supabase.co` si el cliente
      habla con Supabase en prod

### Más a futuro

- Emails Resend (solicitud recibida / aprobado)
- Aprobar socios desde `/admin`
- `useIsAdmin` / `useCanModerate` leyendo socio de Supabase (no solo mock)
- Google OAuth real
- Cloudflare Turnstile
