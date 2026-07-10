"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";
import { neighborhoods as neighborhoodSeed } from "@/data/neighborhoods";

type Thread = {
  id: string;
  title: string;
  created_at: string;
  neighborhood_id: string | null;
};

type DbNeighborhood = { id: string; slug: string; name: string };

export function ForumBoard() {
  const configured = isSupabaseConfigured();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [dbNeighborhoods, setDbNeighborhoods] = useState<DbNeighborhood[]>([]);
  const [loading, setLoading] = useState(configured);
  const [user, setUser] = useState<User | null>(null);
  const [filterSlug, setFilterSlug] = useState<string>("all");

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [neighborhoodSlug, setNeighborhoodSlug] = useState<string>(neighborhoodSeed[0].slug);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const [threadsRes, neighborhoodsRes, userRes] = await Promise.all([
        supabase!
          .from("forum_threads")
          .select("id, title, created_at, neighborhood_id")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase!.from("neighborhoods").select("id, slug, name"),
        supabase!.auth.getUser(),
      ]);
      setThreads(threadsRes.data ?? []);
      setDbNeighborhoods(neighborhoodsRes.data ?? []);
      setUser(userRes.data.user ?? null);
      setLoading(false);
    }

    load();
  }, [configured]);

  if (!configured) {
    return <ConnectSupabaseBanner feature="the neighborhood forum" />;
  }

  const neighborhoodName = (id: string | null) =>
    dbNeighborhoods.find((n) => n.id === id)?.name ?? "General";

  const filtered =
    filterSlug === "all"
      ? threads
      : threads.filter((t) => {
          const dbMatch = dbNeighborhoods.find((n) => n.slug === filterSlug);
          return dbMatch && t.neighborhood_id === dbMatch.id;
        });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give your thread a title.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    if (!supabase || !user) return;

    const neighborhoodRow = dbNeighborhoods.find((n) => n.slug === neighborhoodSlug);

    const { data: thread, error: threadError } = await supabase
      .from("forum_threads")
      .insert({
        user_id: user.id,
        title: title.trim(),
        neighborhood_id: neighborhoodRow?.id ?? null,
      })
      .select()
      .single();

    if (threadError || !thread) {
      setSubmitting(false);
      setError(threadError?.message ?? "Couldn't create that thread.");
      return;
    }

    if (body.trim()) {
      await supabase.from("forum_posts").insert({
        thread_id: thread.id,
        user_id: user.id,
        body: body.trim(),
      });
    }

    window.location.href = `/forum/${thread.id}`;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterSlug("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filterSlug === "all"
                ? "bg-ocean-500 text-sand-50"
                : "bg-sand-100 text-ocean-700 hover:bg-sand-200 dark:bg-ocean-700 dark:text-sand-100"
            }`}
          >
            All neighborhoods
          </button>
          {neighborhoodSeed.map((n) => (
            <button
              key={n.slug}
              onClick={() => setFilterSlug(n.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filterSlug === n.slug
                  ? "bg-ocean-500 text-sand-50"
                  : "bg-sand-100 text-ocean-700 hover:bg-sand-200 dark:bg-ocean-700 dark:text-sand-100"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>
        {user ? (
          <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Start a thread"}
          </Button>
        ) : (
          !loading && (
            <LinkButton href="/signup" variant="secondary">
              Sign in to post
            </LinkButton>
          )
        )}
      </div>

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="ft-title" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                Title
              </label>
              <input
                id="ft-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Anyone else seeing standing water on Baxter Rd?"
                className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              />
            </div>
            <div>
              <label htmlFor="ft-neighborhood" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                Neighborhood
              </label>
              <select
                id="ft-neighborhood"
                value={neighborhoodSlug}
                onChange={(e) => setNeighborhoodSlug(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              >
                {neighborhoodSeed.map((n) => (
                  <option key={n.slug} value={n.slug}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ft-body" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                First post (optional)
              </label>
              <textarea
                id="ft-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-risk-high dark:text-[#e8895f]">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? "Posting…" : "Start thread"}
            </Button>
          </form>
        </Card>
      )}

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-ocean-600 dark:text-sand-200">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-ocean-600 dark:text-sand-200">
            No threads here yet — be the first to start one.
          </p>
        ) : (
          filtered.map((t) => (
            <Link key={t.id} href={`/forum/${t.id}`}>
              <Card className="transition-colors hover:bg-sand-50 dark:hover:bg-ocean-600/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-ocean-800 dark:text-sand-50">{t.title}</h3>
                  <Badge>{neighborhoodName(t.neighborhood_id)}</Badge>
                </div>
                <p className="mt-1 text-xs text-ocean-500 dark:text-sand-300">
                  {new Date(t.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
