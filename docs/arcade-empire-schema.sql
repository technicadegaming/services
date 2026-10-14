-- Arcade Empire proposed Supabase schema (not applied).
-- Never trust browser-submitted currency, inventory, or unlock balances.
create table if not exists public.arcade_empire_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Arcade Owner',
  created_at timestamptz not null default now()
);
create table if not exists public.arcade_empire_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 0,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.arcade_empire_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sku text not null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  granted_at timestamptz not null default now(),
  unique(user_id,sku)
);
create table if not exists public.arcade_empire_stripe_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);
create index if not exists arcade_empire_entitlements_user_idx on public.arcade_empire_entitlements(user_id);
alter table public.arcade_empire_profiles enable row level security;
alter table public.arcade_empire_saves enable row level security;
alter table public.arcade_empire_entitlements enable row level security;
alter table public.arcade_empire_stripe_events enable row level security;
create policy "Read own profile" on public.arcade_empire_profiles for select to authenticated using (user_id=auth.uid());
create policy "Read own saves" on public.arcade_empire_saves for select to authenticated using (user_id=auth.uid());
create policy "Read own entitlements" on public.arcade_empire_entitlements for select to authenticated using (user_id=auth.uid());
-- Writes must go through authenticated server endpoints or SECURITY DEFINER RPC
-- using server-validated gameplay actions and ownership verification.
-- Do NOT create client insert/update policies for economy tables.
