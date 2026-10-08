-- Run in the client's Supabase SQL editor before enabling the live form.
begin;
create table if not exists public.enquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text not null default '' check (char_length(phone) <= 40),
  service text not null default '' check (char_length(service) <= 100),
  message text not null check (char_length(message) between 20 and 5000),
  consent boolean not null check (consent = true),
  email_status text not null default 'pending' check (email_status in ('pending','accepted')),
  email_id text,
  email_accepted_at timestamptz
);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
grant select, insert, update on public.enquiries to service_role;
create index if not exists enquiries_pending_email on public.enquiries(created_at) where email_status = 'pending';
commit;
-- Rollback: disable the form first. Preserve this table and export enquiries;
-- do not drop a table containing client enquiries to roll back application code.
