# RUNBOOK — Setup inicial Club LRE

> Guía operativa paso a paso para levantar toda la infraestructura del club. **Orden importa** — cada fase depende de la anterior.
>
> **Audiencia**: cualquier miembro del equipo con permisos para crear cuentas y configurar DNS.
>
> **Costo total estimado**: ~$20-25 USD/mes + dominio anual.

---

## Pre-requisitos antes de empezar

- [ ] Acceso a internet y navegador moderno
- [ ] Mail del club o del responsable técnico (va a ser el admin de todas las cuentas)
- [ ] CUIT/CUIL del responsable (para registrar el dominio en NIC Argentina)
- [ ] 2-3 personas identificadas como maintainers del repo (vas a invitarlas a GitHub)

---

## Resumen de cuentas a crear

| #   | Servicio                          | Plan                 | Costo          | Para qué                       |
| --- | --------------------------------- | -------------------- | -------------- | ------------------------------ |
| 1   | **GitHub Organization** `clublre` | Free                 | $0             | Repo, issues, CI               |
| 2   | **Vercel Team**                   | Hobby → Pro ($20/mo) | $0 → $20/mo    | Hosting del sitio              |
| 3   | **Cloudflare**                    | Free                 | $0             | DNS, CDN, DDoS protection      |
| 4   | **NIC Argentina**                 | n/a                  | ~ARS 2.000/año | Registro del dominio `.com.ar` |
| 5   | **Resend**                        | Free (3.000/mes)     | $0             | Emails transaccionales         |
| 6   | **Cloudflare Turnstile**          | Free                 | $0             | CAPTCHA en forms               |
| 7   | **Supabase**                      | Free → Pro ($25/mo)  | $0 → $25/mo    | DB + Auth + Storage            |

**Total cuando esté en producción**: ~$45/mes + dominio anual.

---

## Fase 1 — GitHub (sin Vercel todavía)

### 1.1 Crear la organización

1. Ir a **[github.com/organizations/plan](https://github.com/organizations/plan)**.
2. Click **Create a free organization**.
3. **Organization account name**: `clublre`
4. **Contact email**: el mail del club o del responsable.
5. **Personal account**: tu cuenta personal queda como owner de la org.
6. Completar el captcha → **Next**.

### 1.2 Crear equipos

Una vez creada la org:

1. **Settings → Teams → New team**.
2. **Team name**: `maintainers`
3. **Description**: "Admin del repo — pueden mergear a main."
4. **Visibility**: Visible (default).
5. Crear.
6. Repetir si querés un equipo `contributors` separado.

### 1.3 Invitar maintainers

1. **Settings → People → Invite member**.
2. Ingresar el GitHub username de cada maintainer.
3. Asignar rol: **Owner** (para 1-2 personas clave) o **Member** (resto).
4. Agregar al team `maintainers`.

### 1.4 Configurar seguridad general

1. **Settings → Code security and analysis** — activar todo lo que esté free:
   - Dependency graph ✅
   - Dependabot alerts ✅
   - Dependabot security updates ✅
   - Secret scanning ✅ (si está disponible en free)
   - Code scanning (CodeQL) — opcional, corre en cada PR

---

## Fase 2 — Migrar el repo actual

El repo actual vive en `CheizeX/clublre`. Hay que moverlo a `clublre/clublre`.

### 2.1 Transferir el repo

1. Ir a `github.com/CheizeX/clublre` (cuenta personal del owner actual).
2. **Settings → General → Danger Zone → Transfer ownership**.
3. **New owner**: `clublre`.
4. Confirmar con el password de la cuenta personal.
5. Aceptar la transferencia desde un mail que llega al owner de la org.
6. **Listo**: el repo ahora vive en `github.com/clublre/clublre` con todo el historial preservado (issues, PRs, releases, contributors).

### 2.2 Actualizar remotes locales

Cada dev que tenía cloneado el repo:

```bash
git remote -v   # ver el remote actual
git remote set-url origin git@github.com:clublre/clublre.git
git remote -v   # verificar
```

### 2.3 Branch protection

Ir a `github.com/clublre/clublre/settings/branches` → **Add rule**:

**Regla para `main`**:

- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging:
  - `type-check` (del workflow de CI)
  - `lint`
  - `build`
- ✅ Require conversation resolution before merging
- ✅ Require linear history (squash merge)
- ❌ Allow force pushes (NO)
- ❌ Allow deletions (NO)

**Regla para `develop`** (más permisivo):

- Branch name pattern: `develop`
- ✅ Require status checks (`type-check`, `lint`)
- ❌ Require approvals (opcional — si querés revisión también acá, ponelo)
- ✅ Allow force pushes (a veces útil para squash local)

### 2.4 CODEOWNERS

Verificar que `.github/CODEOWNERS` apunte al team correcto (no a tu user personal):

```bash
# .github/CODEOWNERS
*                       @clublre/maintainers
/app/                   @clublre/maintainers
/components/            @clublre/maintainers
/config/                @clublre/maintainers
/styles/                @clublre/maintainers
next.config.js          @clublre/maintainers
tsconfig.json           @clublre/maintainers
```

### 2.5 Secrets para CI (por ahora vacíos)

`github.com/clublre/clublre/settings/secrets/actions` — agregar cuando se wireen:

- (futuro) `SUPABASE_ACCESS_TOKEN` — para correr migrations desde CI
- (futuro) `VERCEL_TOKEN` — si querés automatizar deploys custom

Por ahora no se necesitan (sacamos Sentry).

---

## Fase 3 — Vercel (después de GitHub)

### 3.1 Crear la cuenta Team

1. **[vercel.com/signup](https://vercel.com/signup)** → **Continue with GitHub**.
2. **⚠️ IMPORTANTE**: cuando pida permisos, autorizar acceso a la org `clublre` (no a la cuenta personal).
3. Una vez en el dashboard, **Settings → General → Team name**: `clublre`.

### 3.2 Plan

1. **Settings → Billing → Plan**.
2. **Hobby** durante la maqueta (no comercial — sirve para preview deploys y todo lo que necesitamos para iterar).
3. **Pro** ($20/mes por seat) **cuando se haga el primer deploy a producción real**.

### 3.3 ⚠️ Región — CRÍTICO

**Settings → General → Region** → **São Paulo (gru1)**.

**No se puede cambiar después** del primer deploy. Rosario → São Paulo = ~50ms RTT (vs ~180ms a US East).

### 3.4 Importar el proyecto

1. **Add New → Project**.
2. Seleccionar `clublre/clublre` de la lista.
3. Framework preset: **Next.js** (auto-detectado).
4. **Root Directory**: `./` (default).
5. **Build Command**: `next build` (default).
6. **Install Command**: `pnpm install` (importante — el proyecto usa pnpm).
7. **Output Directory**: default.
8. Click **Deploy**.

### 3.5 Configuración post-import

- **Settings → Git**:
  - Production Branch: `main` ✅
  - Ignored Build Step: dejar vacío
- **Settings → Members**: invitar a quien más necesite acceso.

---

## Fase 4 — Registrar el dominio en NIC Argentina

El dominio `clublre.com.ar` se registra en **[nic.ar](https://nic.ar)** o en un NIC-accredited reseller.

### 4.1 Si el dominio NO está registrado

**En NIC Argentina directamente**:

1. Ir a **[nic.ar/registrar](https://nic.ar/registrar)**.
2. Buscar disponibilidad de `clublre.com.ar`.
3. Si está libre, completar el formulario de registro:
   - **Titular**: la asociación civil (necesita CUIT) o el responsable individual.
   - **Persona responsable**: alguien con DNI.
   - **Contacto técnico y administrativo**: mail del club.
4. Subir documentación (DNI del responsable, si es persona jurídica: acta de designación de autoridades).
5. Pagar (ARS 1.500-3.000 según período).
6. Esperar aprobación (24-72 horas hábiles).

**Alternativa más rápida: DonWeb** (reseller NIC-accredited):

- Mismo resultado, panel más amigable, soporte en español.
- ~ARS 2.000-3.000/año.
- Tiempo de registro: similar.

### 4.2 Si el dominio YA está registrado

Saltear este paso. Anotar en qué panel está (NIC directo, DonWeb, otro) y quién tiene las credenciales.

---

## Fase 5 — Cloudflare DNS

Cloudflare va a gestionar el DNS del dominio. Free tier alcanza de sobra.

### 5.1 Crear cuenta y agregar el sitio

1. **[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)** → crear cuenta.
2. **Add Site** → `clublre.com.ar`.
3. Plan: **Free**.
4. Cloudflare escanea los DNS records existentes.

### 5.2 Cambiar nameservers en NIC Argentina / DonWeb

Cloudflare te asigna **2 nameservers** (ej: `ulla.ns.cloudflare.com` y `sid.ns.cloudflare.com`).

1. En el panel de NIC Argentina (o DonWeb), ir a **DNS / Nameservers**.
2. Cambiar los nameservers a los de Cloudflare.
3. Guardar.

**Propagación**: 5 minutos a 24 horas. Cloudflare te avisa por mail cuando esté listo.

### 5.3 Configurar DNS records en Cloudflare

Una vez que Cloudflare tiene control del DNS:

#### Records para Vercel

Vercel te da los records exactos cuando agregues el dominio (Fase 6). Por ahora dejar preparado:

```
Type    Name    Content                    Proxy
A       @       76.76.21.21                DNS only (gris)  ← Vercel te confirmará el IP
CNAME   www     cname.vercel-dns.com       DNS only (gris)
```

> **Importante**: para Vercel, el proxy debe estar en **gris (DNS only)**, no en naranja. Vercel necesita ver el tráfico directo.

#### Records para Resend (cuando se configure)

Resend te da los records exactos al verificar el dominio. Por defecto:

```
Type     Name                      Content
TXT      @                         "v=spf1 include:_spf.resend.com ~all"
TXT      resend._domainkey         (DKIM key que da Resend)
TXT      _dmarc                    "v=DMARC1; p=none;"
```

#### Record para Cloudflare Turnstile (cuando se configure)

Turnstile no necesita un record DNS — solo agregás el dominio en el dashboard de Cloudflare.

---

## Fase 6 — Vincular dominio en Vercel

1. **Vercel → Settings → Domains → Add**.
2. Ingresar `clublre.com.ar` y `www.clublre.com.ar`.
3. Vercel valida y te devuelve los records a agregar (si los nuestros de Fase 5.3 no coinciden).
4. Confirmar.
5. Vercel emite SSL automáticamente (Let's Encrypt).
6. Verificar que en el listado aparezca ✅ para ambos.

---

## Fase 7 — Servicios (después del dominio)

### 7.1 Resend

1. Crear cuenta en **[resend.com](https://resend.com)**.
2. **Domains → Add domain** → `clublre.com.ar`.
3. Resend muestra los DNS records a agregar (SPF, DKIM). Copiar.
4. Agregar esos records en **Cloudflare DNS** (Fase 5.3).
5. Click **Verify** en Resend. Tarda unos minutos.
6. Crear **API Key** en **API Keys → Create API Key** con permiso `Sending access`.
7. Guardar el key (se muestra una sola vez).
8. En Vercel → **Settings → Environment Variables**:
   - `RESEND_API_KEY` = el key
   - `RESEND_FROM_EMAIL` = `noreply@clublre.com.ar`

### 7.2 Cloudflare Turnstile

1. En **[dash.cloudflare.com](https://dash.cloudflare.com)** → **Turnstile → Add widget**.
2. **Widget name**: `clublre-app`.
3. **Hostname**: `clublre.com.ar` + `*.clublre.com.ar` (para que funcione en www y previews).
4. **Widget mode**: **Invisible** (no muestra puzzles al usuario).
5. Crear.
6. Copiar **Site Key** y **Secret Key**.
7. En Vercel → **Environment Variables**:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = Site Key
   - `TURNSTILE_SECRET_KEY` = Secret Key

### 7.3 Supabase

1. Crear cuenta en **[supabase.com](https://supabase.com)**.
2. **New project**.
3. **⚠️ IMPORTANTE — Región**: **South America (São Paulo)** — coincide con Vercel.
4. **Database password**: generar uno fuerte, guardarlo (es el `postgres` user).
5. Crear.
6. **Settings → API**:
   - Copiar **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copiar **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copiar **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ server-only
7. En Vercel → **Environment Variables** (los 3 valores).

### 7.4 Variables de entorno completas en Vercel

Una vez configurados los 3 servicios, **Vercel → Settings → Environment Variables** debería tener:

| Variable                         | Entornos                         | Valor                            |
| -------------------------------- | -------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Production, Preview, Development | URL de Supabase                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Production, Preview, Development | anon key de Supabase             |
| `SUPABASE_SERVICE_ROLE_KEY`      | Production, Preview, Development | service_role key (⚠️)            |
| `NEXT_PUBLIC_APP_URL`            | Production                       | `https://clublre.com.ar`         |
|                                  | Preview                          | `https://preview-xxx.vercel.app` |
|                                  | Development                      | `http://localhost:3000`          |
| `RESEND_API_KEY`                 | Production, Preview, Development | API key de Resend                |
| `RESEND_FROM_EMAIL`              | Production, Preview, Development | `noreply@clublre.com.ar`         |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production, Preview, Development | Site Key de Turnstile            |
| `TURNSTILE_SECRET_KEY`           | Production, Preview, Development | Secret Key de Turnstile          |

---

## Fase 8 — Verificación final

Después de completar todo:

- [ ] Abrir `https://clublre.com.ar` → debe cargar el sitio con candado verde (SSL válido).
- [ ] Abrir `https://www.clublre.com.ar` → debe redirigir al apex.
- [ ] Hacer un cambio chico en el repo → PR → ver preview URL de Vercel.
- [ ] Mergear el PR → ver deploy automático a producción.
- [ ] Enviar un email de prueba con Resend (cuando se wiree el código).
- [ ] Verificar Turnstile en el form de application.
- [ ] Insertar un row de prueba en Supabase desde el dashboard.

---

## Costos finales

| Concepto                  | Dev           | Prod (~1000 socios) |
| ------------------------- | ------------- | ------------------- |
| GitHub Org                | $0            | $0                  |
| Vercel Hobby → Pro        | $0            | $20/mo              |
| Cloudflare                | $0            | $0                  |
| NIC Argentina (`.com.ar`) | ARS 2.000/año | ARS 2.000/año       |
| Resend                    | $0            | $0                  |
| Turnstile                 | $0            | $0                  |
| Supabase                  | $0            | $25/mo              |
| **TOTAL**                 | **$0**        | **~$45/mes**        |

---

## Troubleshooting común

### "No me deja mergear el PR" en GitHub

- Falta approval de un maintainer.
- Faltan checks de CI pasar.
- Branch protection configurado mal — revisar Fase 2.3.

### "El dominio no resuelve" después de cambiar nameservers

- Propagación DNS puede tardar hasta 24h.
- Verificar con `dig clublre.com.ar NS` que apunten a Cloudflare.
- En Cloudflare, esperar a que diga "Active".

### "Vercel no emite el certificado SSL"

- Verificar que los records A/CNAME en Cloudflare estén en **gris (DNS only)**, no en naranja.
- Esperar unos minutos — Vercel reintenta automáticamente.
- Si persiste, forzar renewal desde Vercel dashboard.

### "Resend dice 'domain not verified'"

- Verificar que los records DKIM/SPF estén exactamente como Resend los dio (un caracter de menos y no verifica).
- Esperar 5-10 minutos después de agregar los records.

### "Supabase dice 'Invalid API key'"

- Confundir anon key con service_role key (son distintas).
- Verificar que `SUPABASE_SERVICE_ROLE_KEY` NO tenga prefijo `NEXT_PUBLIC_`.

---

## Una vez completado

Actualizar este RUNBOOK con:

- Links a los proyectos reales (no los placeholders).
- Fechas de cuándo se completó cada fase.
- Credenciales guardadas en dónde (1Password, Bitwarden, etc.).
- Decisiones que se tomaron durante el setup.

---

**¿Dudas?** Revisar `STACK.md` para entender qué hace cada servicio, o `MAQUETA.md` para entender el estado actual del proyecto.
