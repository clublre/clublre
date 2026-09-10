-- Tabla de socios (1:1 con auth.users) + RLS.
-- Pegar y ejecutar esto en el SQL Editor del dashboard de Supabase.
--
-- Auth = puede entrar. members.account_status = es socio aprobado.
-- Activar a mano por ahora: UPDATE … SET account_status = 'active'.
-- Ver docs/AUTH.md.

create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  last_initial text not null,
  email text not null unique,
  zone text not null,
  member_since date not null default current_date,
  account_status text not null default 'pending'
    check (account_status in ('pending', 'active', 'suspended', 'rejected')),
  role text not null default 'member'
    check (role in ('member', 'moderator', 'admin')),
  approved_by uuid references public.members (id),
  approved_at timestamptz,
  application_note text
);

alter table public.members enable row level security;

drop policy if exists "members_select_own" on public.members;
create policy "members_select_own"
  on public.members for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "members_insert_own" on public.members;
create policy "members_insert_own"
  on public.members for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "members_update_own_profile" on public.members;
create policy "members_update_own_profile"
  on public.members for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and account_status = (select m.account_status from public.members m where m.id = auth.uid())
    and role = (select m.role from public.members m where m.id = auth.uid())
  );
