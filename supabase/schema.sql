-- supabase/schema.sql — mini-CRM del taller «Cursor a fondo» (9punto5)
-- Montos en CLP como integer: PostgREST los devuelve como number en JSON.
-- (numeric llegaría como string y "1200000" + "850000" concatena en vez de sumar.)
-- Idempotente: se puede volver a correr sin error.

create table if not exists public.clients (
  id          integer primary key,
  name        text    not null,
  city        text    not null,
  created_on  date    not null
);

create table if not exists public.quotes (
  id          integer primary key,
  client_id   integer not null references public.clients(id),
  issued_on   date    not null,
  amount_clp  integer not null check (amount_clp >= 0),
  status      text    not null check (status in ('enviada', 'aceptada', 'rechazada'))
);

create table if not exists public.invoices (
  id          integer primary key,
  client_id   integer not null references public.clients(id),
  quote_id    integer null     references public.quotes(id),
  issued_on   date    not null,
  due_on      date    not null,
  amount_clp  integer not null check (amount_clp >= 0),
  paid        boolean not null default false
);

-- RLS: la app usa solo la anon key y solo lee.
-- Sin estas políticas, la API responde [] (sin error) y el widget muestra $0.
alter table public.clients  enable row level security;
alter table public.quotes   enable row level security;
alter table public.invoices enable row level security;

drop policy if exists "taller_lectura" on public.clients;
drop policy if exists "taller_lectura" on public.quotes;
drop policy if exists "taller_lectura" on public.invoices;

create policy "taller_lectura" on public.clients  for select to anon, authenticated using (true);
create policy "taller_lectura" on public.quotes   for select to anon, authenticated using (true);
create policy "taller_lectura" on public.invoices for select to anon, authenticated using (true);

-- Permiso de lectura explícito para la Data API (por si el proyecto no lo otorga por defecto).
-- Solo SELECT: la app no escribe.
grant usage on schema public to anon, authenticated;
grant select on public.clients, public.quotes, public.invoices to anon, authenticated;
