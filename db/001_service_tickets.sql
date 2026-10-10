-- Technicade service tickets, initial private database schema.
-- Apply in a dedicated Supabase project only after reviewing this migration.
-- Public/anon clients have NO direct table permissions; use validated server endpoints.
create extension if not exists pgcrypto;

create table if not exists public.tc_customers (
 id uuid primary key default gen_random_uuid(),
 full_name text not null check (char_length(full_name) between 1 and 160),
 email text not null check (char_length(email) between 3 and 320),
 phone text,
 created_at timestamptz not null default now()
);

create table if not exists public.tc_tickets (
 id uuid primary key default gen_random_uuid(),
 ticket_number bigint generated always as identity unique,
 customer_id uuid not null references public.tc_customers(id),
 subject text not null check (char_length(subject) between 3 and 180),
 description text not null check (char_length(description) between 5 and 10000),
 service_type text not null default 'other',
 device_type text,
 status text not null default 'new'
   check (status in ('new','reviewing','quoted','approved','scheduled','in_progress','awaiting_customer','completed','closed','cancelled')),
 priority text not null default 'normal' check (priority in ('low','normal','high')),
 estimated_cents bigint check (estimated_cents is null or estimated_cents >= 0),
 currency text not null default 'usd',
 stripe_checkout_session_id text unique,
 stripe_payment_intent_id text unique,
 payment_status text not null default 'unpaid'
   check (payment_status in ('unpaid','pending','paid','refunded','partially_refunded')),
 remote_consent_at timestamptz,
 remote_consent_version text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.tc_ticket_events (
 id bigint generated always as identity primary key,
 ticket_id uuid not null references public.tc_tickets(id) on delete cascade,
 actor_type text not null check (actor_type in ('customer','technician','system')),
 event_type text not null,
 note text check (char_length(note) <= 10000),
 created_at timestamptz not null default now()
);

create table if not exists public.tc_ticket_messages (
 id uuid primary key default gen_random_uuid(),
 ticket_id uuid not null references public.tc_tickets(id) on delete cascade,
 sender_type text not null check (sender_type in ('customer','technician')),
 message text not null check (char_length(message) between 1 and 10000),
 is_internal boolean not null default false,
 created_at timestamptz not null default now()
);

create table if not exists public.tc_estimates (
 id uuid primary key default gen_random_uuid(),
 ticket_id uuid not null references public.tc_tickets(id) on delete cascade,
 description text not null,
 amount_cents bigint not null check(amount_cents >= 0),
 currency text not null default 'usd',
 status text not null default 'draft' check(status in ('draft','sent','accepted','declined','expired')),
 approved_at timestamptz,
 created_at timestamptz not null default now()
);

create table if not exists public.tc_remote_sessions (
 id uuid primary key default gen_random_uuid(),
 ticket_id uuid not null references public.tc_tickets(id) on delete cascade,
 provider text not null,
 provider_session_reference text,
 started_at timestamptz,
 ended_at timestamptz,
 explicit_consent_at timestamptz,
 created_at timestamptz not null default now()
);

create index if not exists tc_tickets_status_created_idx on public.tc_tickets(status,created_at desc);
create index if not exists tc_tickets_customer_idx on public.tc_tickets(customer_id);
create index if not exists tc_ticket_events_ticket_idx on public.tc_ticket_events(ticket_id,created_at desc);
create index if not exists tc_ticket_messages_ticket_idx on public.tc_ticket_messages(ticket_id,created_at);
create index if not exists tc_estimates_ticket_idx on public.tc_estimates(ticket_id);
create index if not exists tc_remote_sessions_ticket_idx on public.tc_remote_sessions(ticket_id);

create or replace function public.tc_set_ticket_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
 new.updated_at = now();
 return new;
end $$;
drop trigger if exists tc_ticket_updated_at_trigger on public.tc_tickets;
create trigger tc_ticket_updated_at_trigger before update on public.tc_tickets
for each row execute function public.tc_set_ticket_updated_at();

alter table public.tc_customers enable row level security;
alter table public.tc_tickets enable row level security;
alter table public.tc_ticket_events enable row level security;
alter table public.tc_ticket_messages enable row level security;
alter table public.tc_estimates enable row level security;
alter table public.tc_remote_sessions enable row level security;

-- RLS intentionally has no policies until authenticated staff/customer access
-- is implemented. Only a protected server using service_role can access records.
revoke all on public.tc_customers, public.tc_tickets, public.tc_ticket_events,
 public.tc_ticket_messages, public.tc_estimates, public.tc_remote_sessions
 from anon, authenticated;
revoke all on sequence public.tc_tickets_ticket_number_seq,
 public.tc_ticket_events_id_seq from anon, authenticated;

-- Important: RLS does not restrict the Supabase service_role. Protect that key
-- in server environment variables only; never include it in static HTML.
