"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";
import { nearestNeighborhood } from "@/data/neighborhoods";

export function FloodReportForm({ onReported }: { onReported?: () => void }) {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(configured);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    supabase?.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setCheckingAuth(false);
    });
  }, [configured]);

  if (!configured) {
    return <ConnectSupabaseBanner feature="community flood reports" />;
  }

  if (checkingAuth) {
    return <Card>Checking your account…</Card>;
  }

  if (!user) {
    return (
      <Card>
        <p className="font-semibold text-ocean-800 dark:text-sand-50">
          Sign in to report flooding
        </p>
        <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">
          We tie reports to an account to keep the map trustworthy for
          everyone.
        </p>
        <LinkButton href="/signup" className="mt-4">
          Create account
        </LinkButton>
      </Card>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (address.trim().length < 3 || description.trim().length < 3) {
      setError("Add a location and a short description.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);
      const geo = await geoRes.json();
      if (!geoRes.ok) {
        setError(geo.error ?? "We couldn't find that location.");
        return;
      }

      const supabase = createClient();
      if (!supabase || !user) return;

      const nearest = nearestNeighborhood(geo.lat, geo.lng);
      const { data: neighborhoodRow } = await supabase
        .from("neighborhoods")
        .select("id")
        .eq("slug", nearest.slug)
        .maybeSingle();

      const { error: insertError } = await supabase.from("flood_reports").insert({
        user_id: user.id,
        neighborhood_id: neighborhoodRow?.id ?? null,
        lat: geo.lat,
        lng: geo.lng,
        description: description.trim(),
        photo_url: photoUrl.trim() || null,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSuccess(true);
      setAddress("");
      setDescription("");
      setPhotoUrl("");
      onReported?.();
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card>
        <p className="font-semibold text-risk-low dark:text-[#5cc98a]">
          Thanks — your report is on the map.
        </p>
        <Button variant="ghost" className="mt-3" onClick={() => setSuccess(false)}>
          Report another
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="fr-address" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
            Where&apos;s it flooding?
          </label>
          <input
            id="fr-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address, intersection, or neighborhood"
            className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
          />
        </div>
        <div>
          <label htmlFor="fr-desc" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
            What are you seeing?
          </label>
          <textarea
            id="fr-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Street flooded, about a foot of water, cars turning around"
            className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
          />
        </div>
        <div>
          <label htmlFor="fr-photo" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
            Photo link (optional)
          </label>
          <input
            id="fr-photo"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Paste a link to a photo you've uploaded elsewhere"
            className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm font-medium text-risk-high dark:text-[#e8895f]">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Reporting…" : "Report flooding"}
        </Button>
        <p className="text-xs text-ocean-500 dark:text-sand-300">
          Reports are public on the map right away. Please only report what
          you can personally see — this builds a shared record neighbors
          rely on.
        </p>
      </form>
    </Card>
  );
}
