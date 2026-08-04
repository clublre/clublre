# Maqueta — Entre Socios (Marketplace del Club)

Esta es una **maqueta navegable** del marketplace interno para socios del Club Los Rosarinos Estudiantil. No tiene backend real: toda la sesión, las publicaciones y los reportes viven en memoria del navegador (zustand + localStorage).

Sirve para mostrar el producto a la comisión directiva, validar el flujo con un grupo chico de socios y detectar huecos antes de invertir en Supabase, SMTP y demás.

---

## Cómo arrancar

```bash
npm install   # si hace falta
npm run dev
```

Abrí `http://localhost:3000` en el navegador.

> **Tip**: abrí la consola del navegador una vez y ejecutá
> `localStorage.clear()` antes de empezar a probar si venís de una
> sesión anterior — los datos mockeados del store se persisten
> ahí y pueden confundir el flujo.

---

## Cuentas sembradas (para probar cada rol)

Hay cuentas precargadas que cubren los tres roles y los cuatro estados de cuenta posibles. Iniciá sesión con cualquiera de estos emails o usá **Google simulado** (entra como Juan Pérez).

### Cuentas activas

| Email                      | Nombre          | Rol           | Para qué sirve                                   |
| -------------------------- | --------------- | ------------- | ------------------------------------------------ |
| `comision@clublre.com.ar`  | María González  | **Admin**     | Acceso completo al panel                         |
| `carlos.l@clublre.com.ar`  | Carlos López    | **Moderador** | Todo el panel salvo suspender usuarios           |
| `juan.perez@example.com`   | Juan Pérez      | Socio         | Tiene 3 publicaciones (botines, pesa, búsquedas) |
| `ana.martinez@example.com` | Ana Martínez    | Socio         | Tiene 1 publicación de servicios                 |
| `pedro.r@example.com`      | Pedro Rodríguez | Socio         | Tiene 1 publicación gratuita                     |
| `lucia.f@example.com`      | Lucía Fernández | Socio         | Tiene 1 publicación **reservada**                |
| `diego.s@example.com`      | Diego Suárez    | Socio         | Tiene 1 publicación de compra                    |

### Cuentas pendientes (la comisión las tiene que aprobar)

| Email                  | Nombre       | Estado    |
| ---------------------- | ------------ | --------- |
| `sofia.c@example.com`  | Sofía Castro | `pending` |
| `martin.l@example.com` | Martín López | `pending` |

> Google simulado entra siempre como **Juan Pérez**. Para entrar como
> admin/mod o como pendiente, escribí el email directamente en el
> campo email del login.

---

## Flujos que vale la pena probar

### 1. Login y descubrimiento del marketplace

1. Entrá con Google simulado (botón "Continuar con Google") o con cualquier email de socio.
2. La navbar suma el item **Entre Socios** y el menú con tus iniciales.
3. Hacé click en **Entre Socios**: ves el listado con filtros por categoría, tipo y precio.
4. Entrá al detalle de cualquier publicación. Probá el botón **Contactar**: abre un modal explicando que el club no procesa el pago y abre WhatsApp o email pre-poblado.

### 2. Publicar como socio

1. Logueado como Juan Pérez, andá a **Entre Socios → Publicar**.
2. Tu primera publicación queda en `pending_review` automáticamente (visible sólo en el panel).
3. La segunda ya entra como `published`.
4. Las fotos hoy son solo de muestra — la maqueta no sube archivos reales.

### 3. Reportar contenido

1. Como socio, abrí el detalle de cualquier publicación.
2. Abajo del precio hay un link "Reportar esta publicación".
3. La comisión lo ve en **Admin → Reportes** y puede ocultar la publicación o desestimar.

### 4. Aprobar nuevas altas

1. Cerrá sesión.
2. Iniciá sesión como `sofia.c@example.com` (estado `pending`).
3. Te redirige a `/cuenta/estado` con el copy "Tu solicitud está en revisión".
4. Volvé a iniciar sesión como **María González** (admin).
5. **Admin → Socios**: ves a Sofía y a Martín. Aprobalos o rechazalos.
6. Iniciá sesión de nuevo con el email aprobado: ya entra como socio activo al marketplace.

### 5. Panel de moderación

1. Como admin o moderador, **Admin → Publicaciones**.
2. Las publicaciones con etiqueta "En revisión" están arriba. Aprobalas o rechazalas.
3. La acción queda registrada en **Admin → Auditoría**.

### 6. Suspender / reactivar (sólo admin)

1. Como admin, **Admin → Socios** → filtro "Activos".
2. Suspender un socio cierra su sesión inmediatamente.
3. Reactivar lo deja activo de nuevo.

---

## Lo que está simulado

- **Auth**: Google es un botón que espera 600 ms y entra como Juan. El email busca en los socios sembrados.
- **Aprobación manual**: las altas pasan por `/cuenta/estado` y requieren acción del admin.
- **Publicaciones**: las acciones (crear, editar, archivar, reportar, ocultar) actualizan el store en memoria y persisten en localStorage.
- **Imágenes**: el campo de imágenes está como placeholder. No hay upload real.
- **Contacto**: WhatsApp y email abren enlaces reales con `wa.me` o `mailto:`. No se envían mensajes desde el sitio.
- **Búsqueda**: filtro client-side sobre el array mockeado. Sin FTS ni Algolia.
- **Auditoría**: tabla append-only local. En producción se persiste en Supabase con RLS que impide UPDATE/DELETE.

## Lo que NO está (todavía)

- Backend real (Supabase / Postgres).
- Emails reales (Resend / SMTP).
- Verificación de email, MFA obligatorio para staff, recuperación de contraseña.
- Subida real de imágenes.
- Pagos y escrow (Mercado Pago).
- Chat interno entre socios.
- Reseñas, calificaciones, búsqueda full-text, notificaciones push.
- Términos y condiciones firmados, política de privacidad legal, registro ante AAIP.
- Backups automatizados (estamos en localStorage).

## Resetear el estado

Si querés volver al estado inicial (logout, altas pendientes, reportes abiertos, etc.) desde la consola del navegador:

```javascript
localStorage.clear();
location.reload();
```

---

## Estructura técnica (referencia rápida)

```
app/                              # Rutas Next.js 16
  login/page.tsx                  # Login mockeado
  registro/page.tsx               # Solicitud de alta
  cuenta/page.tsx                 # Mi cuenta
  cuenta/estado/page.tsx           # Pendiente / rechazado / suspendido
  marketplace/page.tsx             # Listado
  marketplace/[id]/page.tsx       # Detalle
  marketplace/publicar/page.tsx    # Alta
  marketplace/[id]/editar/page.tsx # Edición
  admin/*                         # Panel admin (con sidebar)

components/
  atoms/StatusBadge.tsx           # RoleBadge + StatusBadge
  molecules/UserMenu.tsx           # Dropdown de usuario + SignInTrigger
  pages/auth/                     # LoginForm, ApplicationForm
  pages/account/                   # MyListings
  pages/marketplace/               # ListingCard, ListingFilters,
                                  # MarketplaceBrowser, ListingDetailClient,
                                  # ListingForm, ContactDialog, ReportDialog
  pages/admin/                    # AdminShell, AdminDashboard, MembersTable,
                                  # ListingsModeration, ReportsQueue,
                                  # CategoriesManager, AuditLog

stores/
  auth-store.ts                   # Sesión, signup, approve/reject/suspend
  marketplace-store.ts            # Publicaciones, reportes, auditoría

data/
  marketplace.ts                  # Tipos, categorías, socios, listings, reportes

lib/
  routes.ts                       # Helpers tipados de URL
```

## Stack

- Next.js 16 (App Router + React 19)
- HeroUI v3
- Tailwind CSS v4
- Zustand (con persist a localStorage)
- TypeScript 6 estricto

## Para volver a producción

Cuando estén conformes con el producto:

1. Reemplazar `data/marketplace.ts` + stores por queries a Supabase con la misma forma de tipos.
2. Migrar las Server Actions existentes a Supabase RLS (defensa final de autorización).
3. Sumar Resend como SMTP custom de Supabase Auth.
4. Sumar Cloudflare Turnstile en `/registro` y `/marketplace/publicar`.
5. Endurecer CSP en `next.config.js` con los orígenes nuevos.
6. Backups automatizados (pg_dump en Pro, o script nocturno).
7. Revisar legalmente términos, privacidad y AAIP con un abogado argentino.

---

## Flujo de ramas

Para no pushear todo a `main` usamos dos ramas:

| Rama      | Deploy              | Uso                                          |
| --------- | ------------------- | -------------------------------------------- |
| `main`    | Producción (Vercel) | Sólo recibe PRs ya revisados desde `develop` |
| `develop` | Preview (Vercel)    | Iteración diaria de la maqueta               |

### Cómo trabajar

```bash
# Arrancar cambios nuevos
git checkout develop
git pull origin develop
# ... editar, hacer commits chicos ...
git push origin develop   # Vercel genera un preview URL

# Cuando esté listo para producción
# 1. PR de develop a main (revisar visualmente el preview)
# 2. Merge → Vercel deploya a producción
# 3. develop queda listo para la próxima tanda
```

### Convención de commits

Conventional Commits en español, scope por feature:

```bash
git commit -m "feat(entre-socios): alta de publicación con imagen mock"
git commit -m "fix(admin): suspend no funcionaba con rol moderador"
git commit -m "refactor(navbar): usar dropdown menu en vez de links sueltos"
git commit -m "chore(barrels): reemplazar imports del barrel por directos"
```

### Conventional Commits — TL;DR

- `feat:` nueva funcionalidad visible para el usuario.
- `fix:` arreglo de bug.
- `refactor:` cambio interno sin efecto visible.
- `chore:` tooling, deps, config — sin cambio de comportamiento.
- `docs:` sólo documentación.
- `style:` formato (whitespace, semicolons) sin cambio lógico.
- `test:` agregar o arreglar tests.

Scope sugerido: `entre-socios`, `admin`, `auth`, `home`, `navbar`, `theme`, etc.

---

Cualquier duda con la maqueta, mandame un mensaje.
