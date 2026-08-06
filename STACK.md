# STACK — Propuesta técnica Club LRE

> Documento vivo de la arquitectura propuesta para migrar la maqueta a un producto funcional. **Fecha**: 2026-08-06.
>
> Este doc describe el **futuro deseado**. La maqueta actual sigue funcionando con Zustand + localStorage. La migración es incremental y no rompe nada mientras se hace.

---

## 0. TL;DR

| Capa                 | Tecnología                                     | Costo prod  |
| -------------------- | ---------------------------------------------- | ----------- |
| Framework            | Next.js 16 (App Router + RSC)                  | incluido    |
| UI                   | HeroUI v3 + Tailwind v4                        | incluido    |
| Lenguaje             | TypeScript 6 estricto                          | incluido    |
| Estado cliente (UI)  | Zustand + nuqs                                 | incluido    |
| Backend unificado    | **Supabase** (Postgres + Auth + Storage + RLS) | **$25/mo**  |
| Cliente Supabase SSR | `@supabase/ssr`                                | incluido    |
| Email transaccional  | **Resend** (free tier) + React Email           | **$0**      |
| CAPTCHA              | **Cloudflare Turnstile**                       | **$0**      |
| Hosting              | **Vercel Pro** + edge São Paulo                | **$20/mo**  |
| Web Vitals           | `@vercel/speed-insights`                       | **$0**      |
| **TOTAL**            |                                                | **$45/mes** |

Capacidad del free tier de Resend: **3.000 emails/mes**. Volumen estimado del club: **150-250/mes**. No se paga.

---

## 1. Arquitectura

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser (socio / admin / visitante)                              │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   Vercel CDN   │  ← edge en São Paulo (sa-east-1)
                    │   + Speed      │  ← Web Vitals reales en dashboard
                    │   Insights     │
                    └────────┬───────┘
                             │
                             ▼
        ┌────────────────────────────────────────────┐
        │          Next.js 16 (App Router)           │
        │  Server Components + Server Actions + RSC  │
        └──────┬──────────────────┬─────────────────┘
               │                  │
   ┌───────────┴────┐    ┌────────┴───────┐    ┌────────────┐
   │   Supabase    │    │    Resend      │    │ Turnstile  │
   │               │    │                │    │            │
   │ • Postgres    │    │  • Welcome     │    │ • CAPTCHA  │
   │ • Auth        │    │  • Approved    │    │   en signup│
   │ • Storage     │    │  • Rejected    │    │   + report │
   │   (avatares + │    │  • Suspended   │    │            │
   │    listings + │    │  • Reported    │    │            │
   │    blog)      │    │  • Hidden      │    │            │
   │ • RLS         │    │                │    │            │
   └───────────────┘    └────────────────┘    └────────────┘
```

---

## 2. Stack por categoría — detalle

### 2.1 Frontend (lo que ya está)

#### Next.js 16 (App Router)

**Qué hace en esta app**: define las rutas en `app/*`, ejecuta Server Components por defecto, Server Actions para mutaciones, `viewTransition` nativo, `typedRoutes` para type-safe `<Link>`.

**Por qué**: Server Components bajan el JS enviado al cliente (mejor SEO + performance). Server Actions eliminan API routes para mutaciones simples.

**Alternativas descartadas**: Remix (menos maduro el ecosistema RSC), Astro (mejor para contenido estático), Vite + React Router manual (más piezas).

#### React 19

**Qué hace**: `useOptimistic` para feedback inmediato en mutaciones, `<Form action={serverAction}>` para forms, `ref` como prop normal.

**Por qué**: compatible 100% con HeroUI v3 y Supabase. `useOptimistic` y `<Form>` son mejoras reales.

**Alternativas descartadas**: React 18 (pierde `useOptimistic` y `<Form>`), Preact (incompatible con HeroUI).

#### HeroUI v3

**Qué hace**: 75+ componentes accesibles (Button, Input, Modal, Drawer, Card, Dropdown, Form, Table, Tabs, Toast, Accordion, Tooltip). Wrappers en `components/atoms/`, `molecules/`, `organisms/`.

**Por qué**: construido sobre React Aria → accesibilidad WCAG sin esfuerzo extra. Sin Provider (a diferencia de NextUI v2). Tailwind v4 nativo.

**Alternativas descartadas**: MUI (muy opinionated), Chakra v3 (menos maduro), Radix puro (sin wrappers), shadcn (copy-paste).

#### Tailwind CSS v4

**Qué hace**: utility-first CSS. Tokens centralizados en `styles/globals.css` (`@theme`) + `config/design-tokens.ts`. Dark mode con `class` strategy + `next-themes`.

**Por qué**: config en CSS (no JS), cascade layers explícitas, dark mode nativo, tree-shaking agresivo.

**Alternativas descartadas**: CSS Modules (peor DX), Styled-components/Emotion (rompe RSC), Vanilla Extract (comunidad chica).

#### Zustand (solo UI state)

**Qué hace**: estado efímero de UI (mobile menu, drawer admin, modales abiertos). Los datos de la app NO van a Zustand cuando migremos a Supabase.

**Por qué**: 3KB, sin boilerplate. Funciona en Client Components.

**Alternativas descartadas**: Redux (overkill), Jotai (más complejo), Context API (rerenders innecesarios).

#### nuqs

**Qué hace**: filtros en la URL (`?category=tenis&type=sale`). Compartible, bookmarkeable, server-friendly.

**Por qué**: type-safe sobre `useSearchParams` de Next. Funciona en RSC y Client.

**Alternativas descartadas**: store local (no compartible), `useSearchParams` directo (sin type-safety).

#### next-themes

**Qué hace**: toggle light/dark/system con persistencia. Sin flash en el primer render.

**Por qué**: estándar de facto, 3KB, `attribute="class"` matchea con Tailwind v4.

---

### 2.2 Backend unificado

#### Supabase (Postgres + Auth + Storage + RLS)

**Qué es**: backend-as-a-service. DB Postgres + Auth + file storage + (opcional) realtime + edge functions en una sola pieza.

**Qué hace en la app**:

| Capacidad          | Uso concreto                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Postgres**       | `members`, `listings`, `listing_images`, `categories`, `reports`, `audit_log`, `posts` con Row Level Security. |
| **Auth**           | Email + password, Google OAuth, MFA TOTP para admins. Sesión en cookie httpOnly.                               |
| **Storage**        | Buckets `avatars` (privado), `listings` (público), `blog` (público).                                           |
| **Realtime**       | No se usa por ahora.                                                                                           |
| **Edge Functions** | No se usan. Todo es Server Action.                                                                             |

**Por qué Supabase y no piezas separadas**:

- Una sola consola para DB + auth + storage.
- RLS en Postgres = autorización en DB (defense in depth).
- Región **sa-east-1** (São Paulo) = ~50ms RTT desde Rosario.
- Free tier cubre dev + early launch (500MB DB, 1GB storage, 5GB egress).
- Migración a Pro suave cuando se necesite ($25/mo).

**Casos de uso**:

- **Application**: socio completa form → `auth.signUp()` + INSERT en `members` con `account_status='pending'`. Admin recibe email.
- **Aprobación**: admin click "Aprobar" → Server Action `UPDATE members SET account_status='active' WHERE id=?` + email bienvenida.
- **Publicar**: socio autenticado sube imagen a Storage + INSERT en `listings` + INSERT en `listing_images`.
- **Reportar**: socio autenticado INSERT en `reports`. Admin ve la cola en `/admin/reportes`.

**Región**: AWS São Paulo (sa-east-1).

**Costos**: Free $0 dev / Pro $25/mes prod (8GB DB, 100GB storage, 250GB egress).

**Riesgos**: el plan free es **un solo proyecto por org**. Si necesitamos staging + prod + dev, hay que pagar Pro. RLS policies deben estar bien escritas (bug = leak).

**Alternativas descartadas**: Firebase (NoSQL malo para datos relacionales), AWS RDS+Cognito+S3 (3 vendors), PlanetScale (sin auth/storage), Neon+Clerk+UploadThing (3 vendors vs 1).

#### `@supabase/ssr`

**Qué hace**: cookies de sesión que funcionan en Server Components + Server Actions + Route Handlers. Wrapper oficial de Supabase para Next 16 App Router.

**3 clientes en la app** (crear en `lib/supabase/`):

- `server.ts` → para RSC + Server Actions.
- `client.ts` → para Client Components (raro).
- `admin.ts` → service role, server-only (para webhooks / jobs si los hubiera — hoy no se usa).

**Por qué no `@supabase/auth-helpers-nextjs`**: está **deprecado**. La guía oficial es `@supabase/ssr`.

---

### 2.3 File Storage (avatares + publicaciones + blog)

#### Supabase Storage

**Qué es**: object storage integrado con Supabase. S3-compatible. Soporta buckets públicos y privados, policies por path, image transformations on-the-fly.

**3 buckets**:

```
supabase-storage/
├── avatars/          # privado, solo el dueño + admin leen
│   └── {user_id}/avatar.webp
│
├── listings/         # público para lectura, owner escribe
│   └── {listing_id}/1.webp
│   └── {listing_id}/2.webp
│   └── {listing_id}/3.webp
│
└── blog/             # público, solo admin escribe
    └── {slug}/cover.webp
```

**Caso de uso: foto de perfil del socio**:

1. Socio en `/cuenta`, click en "Cambiar foto".
2. Selecciona imagen (cliente convierte a WebP, redimensiona a 400×400).
3. Server Action valida (5MB max, WebP/JPEG/PNG), sube a `avatars/{user_id}/avatar.webp`.
4. UPDATE `members.avatar_url`.
5. Próxima vez que el socio aparezca (en UserMenu, en su listing, en comentarios), se ve la foto.

**Caso de uso: imágenes de una publicación**:

1. Socio crea listing en `/marketplace/publicar`.
2. Sube hasta 5 imágenes (cliente valida tamaño y convierte a WebP).
3. Server Action sube a `listings/{listing_id}/{1..5}.webp`.
4. INSERT en `listing_images` con `storage_path` y `position`.
5. Listing muestra thumbnails via `?width=400&height=400&resize=cover`.

**Por qué Storage de Supabase y no S3/Cloudflare R2**:

- Integrado con RLS (mismas reglas que las tablas).
- API simple: `supabase.storage.from('avatars').upload(path, file)`.
- Image transformations built-in: `?width=400&height=400`.
- Un solo vendor.

**Policies de Storage (RLS) — resumen**:

- `avatars`: solo el dueño (path = `auth.uid()`) puede escribir/leer su archivo. Admin puede leer todos.
- `listings`: público lee, owner escribe (verifica que el listing es suyo vía join).
- `blog`: público lee, solo admin/mod escribe.

**Optimizaciones**:

- Cliente convierte a **WebP** antes de subir (50-70% más chico que JPEG).
- Redimensiona a máx 1200×1200 en cliente (no subimos fotos de 4K).
- Servimos thumbnails via `?width=400&height=400&resize=cover&quality=80`.
- Límite **5MB por imagen** (8MB para blog covers).

**Riesgos**: storage es barato pero **egress** cuenta. Viralización de una foto puede pasar el límite. Transformaciones on-the-fly usan CPU — abuses masivos pueden ralentizar.

**Alternativas descartadas**: AWS S3 (más setup: IAM, signed URLs, CloudFront), Cloudflare R2 (S3-compatible sin egress fees pero hay que integrarlo con Supabase Auth manualmente), UploadThing (otro vendor), Vercel Blob (no integra con Supabase Auth).

---

### 2.4 Email transaccional

#### Resend (free tier)

**Qué hace**: enviar los 7 emails del flujo de socio.

| Evento                          | Destinatario | Cuándo               |
| ------------------------------- | ------------ | -------------------- |
| "Recibimos tu solicitud"        | Aplicante    | Al registrarse       |
| "Nueva solicitud de X"          | Admins       | Al registrarse       |
| "¡Fuiste aprobado, bienvenido!" | Socio        | Al aprobar           |
| "Tu solicitud no fue aprobada"  | Aplicante    | Al rechazar          |
| "Tu cuenta fue suspendida"      | Socio        | Al suspender (admin) |
| "Nueva publicación reportada"   | Admins       | Al reportar          |
| "Tu publicación fue ocultada"   | Socio dueño  | Al ocultar           |

**Por qué**:

- API moderna (REST, no SMTP), pensada para Next.js.
- **React Email**: templates como componentes React (consistente con el stack).
- DX excelente: dashboard con logs de entrega, bounces, complaints.
- Free tier generoso: **3.000 emails/mes**, 100/día.
- **Volumen del club**: ~150-250 emails/mes. **Siempre en free tier.**

**Costos**: Free $0 / Pro $20/mes por 50K (no se va a usar).

**Riesgos**: requiere verificación de dominio (registros SPF/DKIM/DMARC en DNS). Free tier tiene rate limit de 100/día. No usar para marketing/newsletter.

**Alternativas descartadas**:

- **Brevo (ex-Sendinblue)**: free tier 300/día, SMTP-style pero peor DX que Resend.
- **SendGrid**: 100/día, API vieja.
- **AWS SES**: requiere setup AWS.
- **Gmail SMTP**: riesgo de suspensión.
- **WhatsApp Cloud API**: para urgentes (cuota vence, evento). **No para transaccional/legal.** Sumar en fase 2 si hace falta.

---

### 2.5 CAPTCHA

#### Cloudflare Turnstile

**Qué hace**: validar que el usuario del application form y del report form es humano.

**Por qué**:

- Gratis, sin tracking (no vende data a Google).
- Sin puzzles visuales en la mayoría de los casos (modo invisible).
- API simple: widget client-side + token server-side.
- Privacy-friendly.

**Casos de uso**: `/registro` (application), `ReportDialog`. Verificación server-side en el Server Action.

**Costo**: $0 (gratis ilimitado).

**Riesgos**: requiere dominio verificado en Cloudflare (o acceso a DNS). Token single-use, expira en 300s.

**Alternativas descartadas**: reCAPTCHA (tracking, scoring opaco), hCaptcha (Turnstile es más simple), sin CAPTCHA (bots van a spamear).

---

### 2.6 Hosting & infra

#### Vercel Pro

**Qué hace**: hosting optimizado para Next.js. Build + deploy desde GitHub, edge network, edge functions para `proxy.ts`, preview deploys por PR.

**Por qué**:

- Soporte first-class de Next 16 (es la misma empresa).
- Edge en São Paulo = 50ms RTT desde Rosario.
- Preview deploys automáticos.

**Costos**: Hobby $0 (uso no comercial, ideal para maqueta) / Pro $20/mes por seat (producción del club).

**Riesgos**: Hobby es solo para uso personal/no comercial. Vendor lock-in: deploy solo funciona en Vercel.

**Alternativas descartadas**: Netlify (peor soporte Next 16), AWS Amplify (más ops), self-host (DevOps burden).

#### `@vercel/speed-insights`

**Qué hace**: mide Core Web Vitals (LCP, FID, CLS) reales de usuarios.

**Por qué**: 5KB de bundle, gratis, datos reales (no sintéticos como Lighthouse), factor de ranking SEO.

**Por qué NO Sentry**: Sentry es para errores, Speed Insights es para performance. Cosas distintas. Sentry queda descartado (Vercel logs + Slack cubren el 99%, $26/mes sin justificación).

**Costo**: $0.

---

### 2.7 Observabilidad

#### Vercel runtime logs + log drain a Slack

**Qué hace**: capturar `console.error()` de Server Components, Server Actions, Route Handlers y mandarlos a Slack `#clublre-errores`.

**Setup**: Vercel → Settings → Integrations → Slack → conectar. Settings → Logs → Log Drains → Add → Slack channel. Filter: `level=error`.

**Por qué no Sentry**: para un club con ~1000 socios, Vercel logs + Slack cubren el 99% por $0 vs $26/mes.

**Costo**: $0.

---

## 3. Lo que NO usamos y por qué

| Tecnología                | Por qué NO                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **Mercado Pago**          | Las cuotas las maneja un sistema interno del club. Esta app no procesa pagos.       |
| **Inngest / Temporal**    | No hay workflows multi-paso. Todo es single-step.                                   |
| **Supabase Realtime**     | RSC + `revalidatePath` alcanza para la concurrencia esperada.                       |
| **Vercel Cron / pg_cron** | Sin jobs programados (la cuota la maneja otro sistema).                             |
| **Sentry**                | Vercel logs + Slack cubren el 99% del valor. $26/mes sin justificación.             |
| **Auth.js v5 (NextAuth)** | Supabase Auth integrado con RLS. Menos piezas.                                      |
| **Clerk**                 | SaaS caro, otra dependencia.                                                        |
| **Neon / Railway / RDS**  | Supabase ya tiene DB + Auth + Storage.                                              |
| **AWS S3 + CloudFront**   | Storage de Supabase alcanza. S3 se justifica a >10K imágenes.                       |
| **WhatsApp Cloud API**    | Útil para urgentes. **No para transaccional/legal.** Sumar en fase 2 si hace falta. |
| **i18n (next-intl)**      | Hoy toda la UI es es-AR. Cuando se sume en-US + pt-BR.                              |

---

## 4. Costos — resumen

| Servicio             | Dev        | Prod (~1000 socios) |
| -------------------- | ---------- | ------------------- |
| Supabase Pro         | $0         | $25                 |
| Vercel Pro           | $0 (Hobby) | $20                 |
| Resend               | $0         | $0                  |
| Cloudflare Turnstile | $0         | $0                  |
| Speed Insights       | $0         | $0                  |
| **TOTAL**            | **$0**     | **$45/mes**         |

Comparación con alternativas "enterprise":

| Stack alternativo                                   | Costo estimado |
| --------------------------------------------------- | -------------- |
| Auth0 + Vercel + SendGrid Pro + Sentry Pro + AWS S3 | $200+/mes      |
| Clerk + Vercel + Resend Pro + Sentry Pro + AWS      | $300+/mes      |
| **Stack propuesto**                                 | **$45/mes**    |

---

## 5. Cómo funciona cada feature (walk-through)

### 5.1 Registro de un nuevo socio

```
1. Visitante va a /registro
2. Completa form (nombre, email, zona, teléfono, foto opcional)
3. Turnstile valida (no bot)
4. Server Action: createApplication
   ├─ supabase.auth.signUp(email, password)
   ├─ INSERT INTO members (id, ..., account_status='pending')
   ├─ Si foto: subir a Storage bucket 'avatars'
   ├─ resend.emails.send('application-received', aplicante)
   └─ resend.emails.send('new-application', admins)
5. Aplicante redirigido a /cuenta/estado ("pendiente de revisión")
```

### 5.2 Admin aprueba un socio

```
1. Admin va a /admin/usuarios
2. Ve tabla de socios pending, click "Aprobar"
3. Server Action: approveMember
   ├─ Verifica que actor.role IN ('admin', 'moderador')
   ├─ UPDATE members SET account_status='active' WHERE id=?
   ├─ INSERT INTO audit_log (action='approve_member', ...)
   └─ resend.emails.send('application-approved', socio)
4. Próximo login del socio: ya entra como 'active'
```

### 5.3 Socio publica en Entre Socios

```
1. Socio autenticado va a /marketplace/publicar
2. Completa form: título, descripción, categoría, precio, hasta 5 fotos
3. Cliente valida + convierte imágenes a WebP
4. Server Action: createListing
   ├─ Valida con Zod
   ├─ INSERT INTO listings (..., status='pending_review', owner_id=auth.uid())
   ├─ Para cada imagen: supabase.storage.upload('listings/{id}/{n}.webp')
   ├─ INSERT INTO listing_images (listing_id, storage_path, position)
   └─ revalidatePath('/marketplace')
5. Socio ve su publicación en "Mis publicaciones" con estado "En revisión"
6. Admin modera desde /admin/marketplace → aprueba o rechaza
7. Si aprueba: status='published', aparece en /marketplace para todos
```

### 5.4 Socio cambia su foto de perfil

```
1. Socio va a /cuenta → sección "Mi perfil"
2. Click "Cambiar foto" → abre Dropzone
3. Selecciona imagen → cliente valida (5MB, JPG/PNG/WebP) + convierte a WebP 400×400
4. Server Action: updateAvatar
   ├─ supabase.storage.upload('avatars/{user_id}/avatar.webp', { upsert: true })
   ├─ UPDATE members SET avatar_url=...
   └─ revalidatePath('/cuenta')
5. Foto se ve inmediatamente en:
   - UserMenu (navbar)
   - Listing cards donde es owner
   - Próximos comentarios / chat (cuando se sume)
```

### 5.5 Socio reporta una publicación

```
1. Socio abre publicación en /marketplace/[id]
2. Click "Reportar" → abre Modal
3. Selecciona razón (spam, fraude, duplicado, inapropiado, otro) + detalles
4. Turnstile valida
5. Server Action: reportListing
   ├─ INSERT INTO reports (listing_id, reporter_id, reason, details)
   └─ resend.emails.send('new-report', admins)
6. Aparece en /admin/reportes
```

---

## 6. Schema de la DB (resumen)

```sql
-- Tablas principales
members            -- socios + roles + estados de cuenta
listings           -- publicaciones del marketplace
listing_images     -- imágenes de cada listing (1:N)
categories         -- categorías del marketplace
reports            -- reportes de listings
audit_log          -- log append-only de acciones admin
posts              -- blog

-- Enums
member_role        -- ('socio', 'moderador', 'admin')
account_status     -- ('pending', 'active', 'rejected', 'suspended')
listing_type       -- ('sale', 'wanted', 'service', 'free')
listing_status     -- ('pending_review', 'published', 'archived', 'hidden')
report_reason      -- ('spam', 'fraud', 'duplicate', 'inappropriate', 'other')
report_status      -- ('open', 'resolved_hide', 'resolved_dismiss')

-- Buckets de Storage
avatars (private)
listings (public read)
blog (public read)

-- RLS policies
-- TODAS las tablas tienen RLS. Defense in depth.
```

---

## 7. Variables de entorno (8)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=                  # server-only

# Site
NEXT_PUBLIC_APP_URL=https://clublre.com.ar

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@clublre.com.ar

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

---

## 8. Roadmap de migración (de la maqueta a producción)

### Pre-Migración (Semana -1) — pre-requisitos

Cerrar antes de arrancar la Semana 1. Son bloqueantes para que la migración a Supabase no se complique con deuda preexistente.

- [ ] **Auditoría full del repo** — a11y, SEO, perf, security, UX vs tendencias 2025-2026 → reporte P0/P1/P2
- [ ] **DNS `clublre.com.ar`** — NIC debe apuntar el A record a `216.198.79.1` (Vercel ya tiene el dominio agregado, muestra "Invalid Configuration" hasta propagar)
- [ ] **Speed Insights** — `@vercel/speed-insights` instalado y montado en `app/layout.tsx` (Sentry cleanup ya está hecho en `b211644`)
- [ ] **Tests** — Vitest para units + Playwright para e2e del flujo crítico (login → publicar → contactar)
- [ ] **Verificar cobertura de CI** — Husky pre-commit, lint-staged, commit-msg ya están activos; falta el workflow de Vercel Preview en PRs a `develop`

### Migración (Semanas 0-6)

| Sem | Bloque                                                     | Estado    |
| --- | ---------------------------------------------------------- | --------- |
| 0   | Remover Sentry + agregar Speed Insights                    | parcial   |
| 1   | Setup Supabase (sa-east-1) + migrations + RLS + seed       | por hacer |
| 2   | Supabase Auth + `proxy.ts` + reemplazar stores mock        | por hacer |
| 3   | Marketplace en Server Actions + Supabase Storage           | por hacer |
| 4   | Uploads reales (avatares + listings)                       | por hacer |
| 5   | Resend + templates + emails en cada Server Action          | por hacer |
| 6   | i18n (es-AR default, en-US + pt-BR siguientes) + hardening | por hacer |

**6 semanas estimadas para migrar la maqueta a un producto funcional** (sin contar la semana -1).

---

## 9. Estructura de carpetas esperada post-migración

```
app/
  actions/                       # Server Actions (auth, listings, members, reports)
  api/                           # Route Handlers (webhooks si se suman)
components/                      # igual que hoy
lib/
  supabase/
    server.ts                    # createClient() para RSC + Actions
    client.ts                    # createBrowserClient() (raro)
    admin.ts                     # service-role client (NUNCA client)
  image-convert.ts               # WebP conversion client-side
proxy.ts                          # edge middleware (raíz, no en app/)
supabase/
  migrations/                    # SQL versionado
  seed.sql                       # datos iniciales
emails/                          # React Email templates
```

---

## 10. Preguntas frecuentes (para el equipo)

**¿Por qué no Mongo / NoSQL?**
El dominio es relacional: listings tienen imágenes, members tienen roles, audit log es append-only. Postgres maneja esto naturalmente.

**¿Por qué no self-host?**
Para un club chico sin DevOps, mantener un servidor es trabajo semanal (updates, monitoring, backups). $45/mes en SaaS es menos que 2 horas/mes de mantenimiento.

**¿Qué pasa si Supabase se cae?**
El sitio queda offline (raro, pero posible). Plan B: migrar a Neon + Clerk + UploadThing (esfuerzo ~2 semanas). La DB schema es portable porque es Postgres estándar.

**¿Y si queremos nuestro propio SMTP / dominio?**
Resend verifica el dominio (`clublre.com.ar`) — vos mantenés el control del DNS.

**¿Y la privacidad de los socios?**

- Turnstile: no tracking de Google.
- Resend: no vende datos, GDPR-compliant.
- Supabase: GDPR-compliant, datos en São Paulo.
- Storage: las policies de RLS limitan quién ve qué.

**¿Cuándo sumamos X?**

- Pagos: nunca (lo maneja otro sistema).
- WhatsApp: cuando se justifique (mes 3-6 si hay usuarios pidiendo).
- Multi-idioma: cuando haya socios de habla inglesa/portuguesa.
- App mobile: cuando haya >2000 socios activos.
