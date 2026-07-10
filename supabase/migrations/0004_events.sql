-- Lets residents submit their own events (town halls, block parties, storm
-- prep meetings) instead of the calendar being admin-only content.

alter table public.events add column if not exists user_id uuid references auth.users (id) on delete set null;

create policy "events are insertable by authenticated users"
  on public.events for insert
  with check (auth.uid() = user_id);

-- Seed a couple of real, researched events so the calendar isn't empty on
-- day one. Checked 2026-07-09 — see data/opportunities.ts for sourcing.
insert into public.events (title, category, source, start_at, end_at, location_text, url)
select
  'NAS Oceana Air Show',
  'event',
  'seed',
  '2026-09-19 09:00:00-04'::timestamptz,
  '2026-09-20 17:00:00-04'::timestamptz,
  'NAS Oceana, Virginia Beach',
  'https://www.oceanaairshow.com/'
where not exists (
  select 1 from public.events where title = 'NAS Oceana Air Show'
);
