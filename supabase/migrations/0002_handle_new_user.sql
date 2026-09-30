-- Al crear un user en Auth, crea la ficha en public.members en la misma
-- transacción atómica. Los datos del form llegan en raw_user_meta_data
-- vía signUp({ options: { data: {...} } }) — ver app/actions/auth.ts.
--
-- Pegar y ejecutar en el SQL Editor del dashboard (después de 0001).
-- Ver docs/AUTH.md.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  full_name text := coalesce(nullif(trim(meta->>'full_name'), ''), '');
  last_initial text := coalesce(
    nullif(trim(meta->>'last_initial'), ''),
    upper(left(coalesce(nullif(trim(meta->>'full_name'), ''), '?'), 1)),
    '?'
  );
  zone text := coalesce(nullif(trim(meta->>'zone'), ''), 'A completar');
  note text := nullif(trim(meta->>'application_note'), '');
begin
  insert into public.members (
    id,
    full_name,
    last_initial,
    email,
    zone,
    account_status,
    role,
    application_note
  ) values (
    new.id,
    case when full_name = '' then coalesce(new.email, 'Socio') else full_name end,
    last_initial,
    coalesce(new.email, ''),
    zone,
    'pending',
    'member',
    note
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

comment on function public.handle_new_user() is
  'Crea public.members al insertar en auth.users (signup atómico).';
