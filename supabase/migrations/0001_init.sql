-- Skywatch VB — initial schema
-- MVP tables: profiles, neighborhoods, saved_addresses, alert_subscriptions, opportunities, launches
-- Forward-scaffolded for V2/V3 (no UI yet): flood_reports, events, globe_observations,
-- forum_threads, forum_posts, volunteer_postings

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user, mirrors auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are editable by owner"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- neighborhoods: seeded reference list of VB neighborhoods with flood sensitivity
-- ---------------------------------------------------------------------------
create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  flood_sensitivity smallint not null default 1 check (flood_sensitivity between 1 and 5),
  description text,
  created_at timestamptz not null default now()
);

alter table public.neighborhoods enable row level security;

create policy "neighborhoods are publicly readable"
  on public.neighborhoods for select
  using (true);

-- ---------------------------------------------------------------------------
-- saved_addresses: a user's saved home/work/etc addresses
-- ---------------------------------------------------------------------------
create table if not exists public.saved_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null default 'Home',
  address_text text not null,
  lat double precision not null,
  lng double precision not null,
  neighborhood_id uuid references public.neighborhoods (id),
  created_at timestamptz not null default now()
);

alter table public.saved_addresses enable row level security;

create policy "saved_addresses are managed by owner"
  on public.saved_addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- alert_subscriptions: opt-in flood risk alerts tied to a saved address
-- ---------------------------------------------------------------------------
create table if not exists public.alert_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  saved_address_id uuid not null references public.saved_addresses (id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'push')),
  risk_threshold text not null default 'elevated' check (risk_threshold in ('elevated', 'high', 'severe')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.alert_subscriptions enable row level security;

create policy "alert_subscriptions are managed by owner"
  on public.alert_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- opportunities: aerospace & opportunity hub directory entries
-- ---------------------------------------------------------------------------
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('visit', 'event', 'job', 'internship', 'education')),
  org_name text not null,
  title text not null,
  description text not null,
  url text,
  audience_tags text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.opportunities enable row level security;

create policy "opportunities are publicly readable"
  on public.opportunities for select
  using (true);

-- ---------------------------------------------------------------------------
-- launches: cache of NASA Wallops (and other) launch schedule entries
-- ---------------------------------------------------------------------------
create table if not exists public.launches (
  id uuid primary key default gen_random_uuid(),
  mission_name text not null,
  launch_time timestamptz,
  vehicle text,
  pad text,
  status text not null default 'scheduled' check (status in ('scheduled', 'success', 'failure', 'scrubbed', 'tbd')),
  source_url text,
  updated_at timestamptz not null default now()
);

alter table public.launches enable row level security;

create policy "launches are publicly readable"
  on public.launches for select
  using (true);

-- =============================================================================
-- Forward-scaffolded tables for V2/V3 (no application UI reads/writes these yet)
-- =============================================================================

-- V2: crowdsourced flood photo/report submissions
create table if not exists public.flood_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  neighborhood_id uuid references public.neighborhoods (id),
  lat double precision not null,
  lng double precision not null,
  description text,
  photo_url text,
  reported_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected'))
);

alter table public.flood_reports enable row level security;

create policy "flood_reports are publicly readable"
  on public.flood_reports for select
  using (true);

create policy "flood_reports are insertable by authenticated users"
  on public.flood_reports for insert
  with check (auth.uid() = user_id);

-- V2: events calendar aggregation (launches, air shows, museum days, town halls)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  source text,
  start_at timestamptz not null,
  end_at timestamptz,
  location_text text,
  url text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "events are publicly readable"
  on public.events for select
  using (true);

-- V3: NASA GLOBE Observer-style citizen science log entries
create table if not exists public.globe_observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  obs_type text not null,
  value jsonb not null default '{}',
  lat double precision,
  lng double precision,
  observed_at timestamptz not null default now()
);

alter table public.globe_observations enable row level security;

create policy "globe_observations are managed by owner"
  on public.globe_observations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- V3: neighborhood discussion forum
create table if not exists public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  neighborhood_id uuid references public.neighborhoods (id),
  user_id uuid references auth.users (id) on delete set null,
  title text not null,
  created_at timestamptz not null default now()
);

alter table public.forum_threads enable row level security;

create policy "forum_threads are publicly readable"
  on public.forum_threads for select
  using (true);

create policy "forum_threads are insertable by authenticated users"
  on public.forum_threads for insert
  with check (auth.uid() = user_id);

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.forum_posts enable row level security;

create policy "forum_posts are publicly readable"
  on public.forum_posts for select
  using (true);

create policy "forum_posts are insertable by authenticated users"
  on public.forum_posts for insert
  with check (auth.uid() = user_id);

-- V3: volunteer & mutual-aid board
create table if not exists public.volunteer_postings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  title text not null,
  description text not null,
  category text,
  contact_info text,
  created_at timestamptz not null default now()
);

alter table public.volunteer_postings enable row level security;

create policy "volunteer_postings are publicly readable"
  on public.volunteer_postings for select
  using (true);

create policy "volunteer_postings are insertable by authenticated users"
  on public.volunteer_postings for insert
  with check (auth.uid() = user_id);
