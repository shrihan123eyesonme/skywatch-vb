# Skywatch VB

A community site for Virginia Beach, VA: know your flood risk today, and find
real local aerospace opportunities. Built with Next.js, Tailwind CSS, Leaflet,
and Supabase.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs fully in
dev with **no API keys required** — NOAA, the National Weather Service, and
OpenStreetMap Nominatim are all free, keyless APIs.

## Going live with accounts & alerts

Account creation, saved addresses, and alert signups need a Supabase project.
Until one is connected, those flows show a "connect Supabase" banner instead
of failing silently.

1. Create a free project at [supabase.com](https://supabase.com) (~2 minutes, no card).
2. Run `supabase/migrations/0001_init.sql` in the project's SQL Editor.
3. Copy `.env.local.example` to `.env.local` and fill in your Project URL and anon key.
4. Restart the dev server.

## What's real vs. seeded

- **Live**: NOAA flood-stage data (Sewells Point gauge), NWS alerts and
  forecasts, and address geocoding all call live public APIs on every
  request — see `lib/noaa.ts`, `lib/nws.ts`, `lib/geocode.ts`.
- **Researched, hand-seeded**: the Virginia Beach neighborhood list
  (`data/neighborhoods.ts`) and the aerospace opportunity directory
  (`data/opportunities.ts`) are real, sourced content, not placeholders —
  see the comments at the top of each file for sources and check dates.
- **Snapshot, refresh periodically**: the NASA Wallops launch schedule
  (`data/launches-fallback.ts`) has no stable public API, so it's a dated
  snapshot. The Aerospace Hub always links out to the official schedule.

## Project structure

- `app/` — pages and API routes (App Router)
- `lib/` — data-fetching and business logic (NOAA, NWS, geocoding, the flood
  risk heuristic, Supabase clients)
- `data/` — seeded reference data (neighborhoods, opportunities, launches)
- `components/` — UI, organized by feature area
- `supabase/migrations/` — full schema, including tables scaffolded for V2/V3
  (crowdsourced flood reports, events calendar, citizen science, community
  forum, volunteer board) that don't have UI yet

## Roadmap

MVP (this build): flood risk map + address lookup, alert signup, aerospace
directory, launch tracker, optional accounts.

Next: crowdsourced flood photo reports, NASA GLOBE Observer citizen science,
events calendar aggregation, neighborhood forums, volunteer board, weekly
digest emails.
