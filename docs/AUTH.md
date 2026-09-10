# Auth con Supabase — guía para el equipo

Documento de la integración inicial de registro/login. La maqueta
(Zustand + atajos “Como admin”) **sigue viva** en paralelo.

Para el mapa de clientes ver también `lib/supabase/README.md`.
Para el plan de stack completo ver `STACK.md`.

---

## Idea central

Hay **dos capas** de “usuario”:

| Capa | Dónde | Para qué |
| ---- | ----- | -------- |
| **Auth** | `auth.users` (Supabase Auth) | ¿Puede entrar? Email + password + cookie httpOnly |
| **Socio** | `public.members` | ¿Es socio aprobado? `pending` / `active` / `suspended` / `rejected` + `role` |

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

| Variable | ¿Obligatoria hoy? | Notas |
| -------- | ----------------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | Publishable / anon key |
| `NEXT_PUBLIC_DEPLOY_BRANCH=develop` | Sí en local/preview | Muestra login en la navbar |
| `NEXT_PUBLIC_APP_URL` | Recomendada | `http://localhost:3000` en local |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Bypasea RLS; no hay `admin.ts` cableado aún |
| Resend / Turnstile | No | Próximas features |

Local: `.env.local` (gitignored). Vercel: Project → Environment Variables.

### Dashboard Supabase

1. Correr `supabase/migrations/0001_members.sql` en el **SQL Editor**.
2. Authentication → Email: on. **Confirm email: off** en local
   (si está on, `signUp` no deja sesión y el insert a `members` falla por RLS).
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

supabase/migrations/0001_members.sql  # schema + RLS
```

---

## Flujos

```
/registro → register → auth.users + members(pending) → /cuenta/estado
                              ↓ (activar en DB)
/login (email+pass) → login → /cuenta
Cerrar sesión → logout (cookie) + signOut mock → home
```

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
4. Atajo “Como admin” sigue andando para marketplace demo.
