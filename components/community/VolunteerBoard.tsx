"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";

type Posting = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  contact_info: string | null;
  created_at: string;
};

const CATEGORIES = ["Storm prep", "Cleanup", "Check-in buddy", "Supplies", "Other"];

export function VolunteerBoard() {
  const configured = isSupabaseConfigured();
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(configured);
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [contactInfo, setContactInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPostings() {
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("volunteer_postings")
      .select("id, title, description, category, contact_info, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setPostings(data ?? []);
  }

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const [postingsRes, userRes] = await Promise.all([
        supabase!
          .from("volunteer_postings")
          .select("id, title, description, category, contact_info, created_at")
          .order("created_at", { ascending: false })
          .limit(20),
        supabase!.auth.getUser(),
      ]);
      setPostings(postingsRes.data ?? []);
      setUser(userRes.data.user ?? null);
      setLoading(false);
    }

    load();
  }, [configured]);

  if (!configured) {
    return <ConnectSupabaseBanner feature="the volunteer & mutual-aid board" />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Add a title and a short description.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    if (!supabase || !user) return;
    const { error } = await supabase.from("volunteer_postings").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      contact_info: contactInfo.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTitle("");
    setDescription("");
    setContactInfo("");
    setShowForm(false);
    await loadPostings();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ocean-600 dark:text-sand-200">
          Neighbors offering help, or asking for it — sandbags, storm cleanup,
          checking on someone who needs it.
        </p>
        {user ? (
          <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Post something"}
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
              <label htmlFor="vb-title" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                Title
              </label>
              <input
                id="vb-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sandbags available, Windsor Woods"
                className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              />
            </div>
            <div>
              <label htmlFor="vb-desc" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                Description
              </label>
              <textarea
                id="vb-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="vb-category" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                  Category
                </label>
                <select
                  id="vb-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="vb-contact" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
                  Contact info (optional, shown publicly)
                </label>
                <input
                  id="vb-contact"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Email, phone, or how to reach you"
                  className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
                />
              </div>
            </div>
            {error && (
              <p role="alert" className="text-sm font-medium text-risk-high dark:text-[#e8895f]">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? "Posting…" : "Post to the board"}
            </Button>
          </form>
        </Card>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {loading ? (
          <p className="text-sm text-ocean-600 dark:text-sand-200">Loading…</p>
        ) : postings.length === 0 ? (
          <p className="col-span-full text-sm text-ocean-600 dark:text-sand-200">
            Nothing posted yet — be the first.
          </p>
        ) : (
          postings.map((p) => (
            <Card key={p.id}>
              {p.category && <Badge>{p.category}</Badge>}
              <h3 className="mt-2 font-bold text-ocean-800 dark:text-sand-50">{p.title}</h3>
              <p className="mt-1 text-sm text-ocean-700 dark:text-sand-100">{p.description}</p>
              {p.contact_info && (
                <p className="mt-2 text-sm font-medium text-ocean-600 dark:text-ocean-200">
                  Contact: {p.contact_info}
                </p>
              )}
              <p className="mt-2 text-xs text-ocean-500 dark:text-sand-300">
                {new Date(p.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
