-- Adds what's needed to actually dispatch flood alerts:
-- a phone number to text, and per-subscription tracking so we don't
-- re-notify someone every time the cron job runs while risk stays elevated.

alter table public.profiles
  add column if not exists phone_number text;

alter table public.alert_subscriptions
  add column if not exists last_notified_at timestamptz,
  add column if not exists last_notified_level text;
