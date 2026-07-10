"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";

type Thread = { id: string; title: string; created_at: string };
type Post = { id: string; body: string; created_at: string };

export function ThreadView({ threadId }: { threadId: string }) {
  const configured = isSupabaseConfigured();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(configured);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadThread() {
    const supabase = createClient();
    if (!supabase) return;
    const [threadRes, postsRes] = await Promise.all([
      supabase.from("forum_threads").select("id, title, created_at").eq("id", threadId).maybeSingle(),
      supabase
        .from("forum_posts")
        .select("id, body, created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true }),
    ]);
    if (!threadRes.data) {
      setNotFound(true);
    } else {
      setThread(threadRes.data);
      setPosts(postsRes.data ?? []);
    }
  }

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      await loadThread();
      const { data } = await supabase!.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, threadId]);

  if (!configured) {
    return <ConnectSupabaseBanner feature="the neighborhood forum" />;
  }

  if (loading) {
    return <p className="text-ocean-600 dark:text-sand-200">Loading…</p>;
  }

  if (notFound) {
    return <p className="text-ocean-600 dark:text-sand-200">That thread doesn&apos;t exist.</p>;
  }

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    if (!supabase || !user) return;
    const { error } = await supabase.from("forum_posts").insert({
      thread_id: threadId,
      user_id: user.id,
      body: reply.trim(),
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setReply("");
    await loadThread();
  }

  return (
    <div>
      <Link href="/forum" className="text-sm font-semibold text-coral-700 dark:text-coral-400 hover:underline">
        ← Back to forum
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-ocean-800 dark:text-sand-50">{thread!.title}</h1>

      <div className="mt-6 space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-ocean-600 dark:text-sand-200">No replies yet.</p>
        ) : (
          posts.map((p) => (
            <Card key={p.id}>
              <p className="whitespace-pre-wrap text-ocean-700 dark:text-sand-100">{p.body}</p>
              <p className="mt-2 text-xs text-ocean-500 dark:text-sand-300">
                {new Date(p.created_at).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </Card>
          ))
        )}
      </div>

      <div className="mt-6">
        {user ? (
          <form onSubmit={handleReply} className="flex flex-col gap-3">
            <label htmlFor="reply-body" className="sr-only">
              Reply
            </label>
            <textarea
              id="reply-body"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              placeholder="Add a reply…"
              className="w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
            />
            {error && (
              <p role="alert" className="text-sm font-medium text-risk-high dark:text-[#e8895f]">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? "Posting…" : "Reply"}
            </Button>
          </form>
        ) : (
          <LinkButton href="/signup" variant="secondary">
            Sign in to reply
          </LinkButton>
        )}
      </div>
    </div>
  );
}
