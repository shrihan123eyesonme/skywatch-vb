# Skywatch VB

A community site for Virginia Beach, VA: know your flood risk today, and see
what's happening around the city. Built with Next.js, Tailwind CSS, Leaflet,
and Supabase.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs fully in
dev with **no API keys required** — NOAA, the National Weather Service, and
OpenStreetMap Nominatim are all free, keyless APIs.

## Before this goes live for real users

This app is feature-complete for an MVP, but a few things are genuinely your
call to make before publishing, not something that can be finished in code
alone:

- **Have someone review the flood risk logic.** `lib/risk.ts` is a heuristic
  we built from public NOAA/NWS data — it hasn't been reviewed by a
  hydrologist or emergency manager. It's clearly labeled as an estimate in
  the UI (with an in-app "How we calculate this" explainer), but for
  safety-relevant content, a second set of expert eyes is worth it.
- **Fill in `app/privacy/page.tsx` and `app/terms/page.tsx`.** Both are real,
  usable drafts (data collection, SMS/TCPA consent language, liability
  disclaimers) but have `[DATE]` and `[CONTACT EMAIL]` placeholders and
  haven't been reviewed by a lawyer.
- **Real local photography.** The design brief asked for real Virginia Beach
  photography over stock imagery. We can't source or license photos on your
  behalf, so the site currently uses original illustration (custom SVG waves,
  icons, a coastline divider) instead of photos as a placeholder-free
  alternative. Swap in real photos when you have them.

## Connecting the services that make this fully live

Every one of these has a graceful fallback — the site is fully browsable and
honest about what's not connected yet ("connect Supabase" banners, a "cached
snapshot" badge on the launch tracker, etc.) if you skip any of them.

### 1. Supabase — accounts, saved addresses, alerts

1. Create a free project at [supabase.com](https://supabase.com) (~2 minutes, no card).
2. Run `supabase/migrations/0001_init.sql` then `0002_notifications.sql` in
   the project's SQL Editor, in that order.
3. Copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (Project
   Settings → API). The service role key is needed for account deletion and
   the alert-check cron job — keep it server-side only, never in client code.
4. Restart the dev server.

### 2. Resend + Twilio — actually sending alerts

Without these, alert signups save to the database but nothing gets sent.

1. Create a [Resend](https://resend.com) account, verify a sending domain,
   set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.
2. Create a [Twilio](https://twilio.com) account, buy a number, set
   `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`.

### 3. The alert-check cron job

`GET /api/cron/check-alerts` checks every active subscription against
current conditions and sends notifications when someone's threshold is
crossed. It's protected by a shared secret — set `CRON_SECRET` to any random
string (`openssl rand -hex 32`) in `.env.local` and wherever you trigger it.

Two ways to trigger it, and you can use either or both:

- **Vercel Cron** (`vercel.json`, already configured) — runs once a day.
  Free on Vercel's Hobby tier, zero extra setup once you deploy and set
  `CRON_SECRET` as a Vercel env var. Good for keeping things basically
  fresh, but flood conditions can change faster than once a day.
- **GitHub Actions** (`.github/workflows/check-alerts.yml`) — runs every 30
  minutes. Needs the repo pushed to GitHub with two repo secrets: `APP_URL`
  (your deployed URL) and `CRON_SECRET` (same value as above). This is the
  one we'd actually recommend for a safety feature — flood risk shouldn't
  wait a day to notify someone.

### 4. Deploying

The app is ready for Vercel (`vercel.json` is already set up for the cron
job). We haven't deployed it for you — `vercel deploy` from this directory
once you're ready, with the env vars above set in the Vercel dashboard.

## What's real vs. seeded vs. live-scraped

- **Live, called fresh on every request**: NOAA flood-stage data (Sewells
  Point gauge), NWS alerts and forecasts, and address geocoding — see
  `lib/noaa.ts`, `lib/nws.ts`, `lib/geocode.ts`.
- **Live, refreshed daily**: the NASA Wallops launch schedule is scraped
  directly from NASA's own schedule page (`lib/wallops.ts`), cached for 24
  hours. If NASA changes their page markup and scraping fails, it falls back
  to the last-known-good snapshot in `data/launches-fallback.ts` rather than
  showing nothing — the UI shows a "Live from NASA today" vs. "Cached
  snapshot" badge so it's never ambiguous which one you're looking at.
- **Researched, hand-seeded**: the Virginia Beach neighborhood list
  (`data/neighborhoods.ts`) and the community opportunity directory
  (`data/opportunities.ts`) are real, sourced content, not placeholders —
  see the comments at the top of each file for sources and check dates.
  These will go stale eventually (museum hours, air show dates) and need a
  periodic manual review — there's no live source to scrape for them.

## Project structure

- `app/` — pages and API routes (App Router)
- `lib/` — data-fetching and business logic (NOAA, NWS, geocoding, the flood
  risk heuristic, Supabase clients, email/SMS dispatch, rate limiting)
- `data/` — seeded reference data (neighborhoods, opportunities, launches)
- `components/` — UI, organized by feature area
- `supabase/migrations/` — full schema, including tables scaffolded for V2/V3
  (crowdsourced flood reports, events calendar, citizen science, community
  forum, volunteer board) that don't have UI yet

## Notes on scale

A few things are intentionally MVP-scale and documented as such in code
comments, rather than silently fragile:

- **Rate limiting** (`lib/rateLimit.ts`) is in-memory — fine for a single
  instance, resets on cold start, doesn't share state across serverless
  instances. Swap for Upstash Redis at real traffic.
- **Geocoding** caches identical lookups for 24h via Next's fetch cache to
  stay well within OpenStreetMap Nominatim's usage policy. At high volume,
  move to a paid geocoding provider.

## Roadmap

MVP (this build): flood risk map + address lookup, working alert signup and
dispatch, a searchable community directory + launch tracker, accounts with
account deletion.

Next: crowdsourced flood photo reports, NASA GLOBE Observer citizen science,
events calendar aggregation, neighborhood forums, volunteer board, weekly
digest emails.
