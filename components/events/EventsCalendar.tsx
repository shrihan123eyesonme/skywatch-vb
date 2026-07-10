"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";

type DbEvent = {
  id: string;
  title: string;
  category: string | null;
  start_at: string;
  end_at: string | null;
  location_text: string | null;
  url: string | null;
};

function formatRange(startIso: string, endIso: string | null) {
  const start = new Date(startIso);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  if (!endIso) return start.toLocaleDateString(undefined, opts);
  const end = new Date(endIso);
  if (start.toDateString() === end.toDateString()) return start.toLocaleDateString(undefined, opts);
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

export function EventsCalendar() {
  const configured = isSupabaseConfigured();
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(configured);
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Town hall");
  const [startAt, setStartAt] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadEvents() {
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("events")
      .select("id, title, category, start_at, end_at, location_text, url")
      .gte("start_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString())
      .order("start_at", { ascending: true })
      .limit(50);
    setEvents(data ?? []);
  }

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      await loadEvents();
      const { data } = await supabase!.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    }

    load();
  }, [configured]);

  if (!configured) {
    return <ConnectSupabaseBanner feature="the community events calendar" />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startAt) {
      setError("Add a title and a date/time.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    if (!supabase || !user) return;
    const { error } = await supabase.from("events").insert({
      user_id: user.id,
      title: title.trim(),
      category,
      start_at: new Date(startAt).toISOString(),
      location_text: location.trim() || null,
      url: url.trim() || null,
      source: "community",
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTitle("");
    setStartAt("");
    setLocation("");
    setUrl("");
    setShowForm(false);
    await loadEvents();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ocean-600 dark:text-sand-200">
          Town halls, meetups, storm-prep sessions — anything happening in the
          city, added by neighbors.
        </p>
        {user ? (
          <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Add an event"}
          </Button>
        ) : (
          !loading && (
            <LinkButton href="/signup" variant="secondary">
              Sign in to add one
            </LinkButton>
          )
        )}
      </div>

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="ev-title" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                Title
              </label>
              <input
                id="ev-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="ev-category" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                  Category
                </label>
                <select
                  id="ev-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
                >
                  {["Town hall", "Meetup", "Storm prep", "Fundraiser", "Other"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ev-start" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                  Date & time
                </label>
                <input
                  id="ev-start"
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="ev-location" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                Location (optional)
              </label>
              <input
                id="ev-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              />
            </div>
            <div>
              <label htmlFor="ev-url" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                Link (optional)
              </label>
              <input
                id="ev-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-risk-high dark:text-[#e8895f]">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? "Adding…" : "Add to calendar"}
            </Button>
          </form>
        </Card>
      )}

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-ocean-600 dark:text-sand-200">Loading…</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-ocean-600 dark:text-sand-200">
            Nothing on the calendar yet — add the first thing.
          </p>
        ) : (
          events.map((ev) => (
            <Card key={ev.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {ev.category && <Badge>{ev.category}</Badge>}
                  <h3 className="font-bold text-ocean-800 dark:text-sand-50">{ev.title}</h3>
                </div>
                {ev.location_text && (
                  <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">{ev.location_text}</p>
                )}
                {ev.url && (
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm font-semibold text-coral-700 dark:text-coral-400 hover:underline"
                  >
                    More info →
                  </a>
                )}
              </div>
              <p className="whitespace-nowrap text-sm font-semibold text-ocean-700 dark:text-sand-100">
                {formatRange(ev.start_at, ev.end_at)}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
