"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";
import { AlertSignupForm } from "@/components/flood-watch/AlertSignupForm";

type SavedAddress = { id: string; label: string; address_text: string };
type AlertSubscription = { id: string; channel: string; active: boolean; saved_address_id: string };

export default function AccountPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [subscriptions, setSubscriptions] = useState<AlertSubscription[]>([]);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        const [{ data: addressRows }, { data: subRows }] = await Promise.all([
          supabase.from("saved_addresses").select("id, label, address_text").eq("user_id", data.user.id),
          supabase.from("alert_subscriptions").select("id, channel, active, saved_address_id").eq("user_id", data.user.id),
        ]);
        setAddresses(addressRows ?? []);
        setSubscriptions(subRows ?? []);
      }
      setLoading(false);
    });
  }, [configured]);

  if (!configured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-ocean-800 dark:text-sand-50">My Account</h1>
        <div className="mt-6">
          <ConnectSupabaseBanner feature="user accounts" />
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-ocean-800 dark:text-sand-50">My Account</h1>
        <Card className="mt-6">
          <p className="text-ocean-700 dark:text-sand-100">
            Log in to save an address, manage flood alerts, and track your contributions.
          </p>
          <div className="mt-4 flex gap-3">
            <LinkButton href="/login">Log in</LinkButton>
            <LinkButton href="/signup" variant="secondary">
              Sign up
            </LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ocean-800 dark:text-sand-50">My Account</h1>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
      <p className="mt-1 text-ocean-600 dark:text-sand-200">{user.email}</p>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-ocean-800 dark:text-sand-50">
          Saved addresses & alerts
        </h2>
        {addresses.length === 0 ? (
          <p className="mt-2 text-ocean-600 dark:text-sand-200">
            No saved addresses yet — add one below.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {addresses.map((a) => {
              const subs = subscriptions.filter((s) => s.saved_address_id === a.id);
              return (
                <li key={a.id}>
                  <Card>
                    <p className="font-semibold text-ocean-800 dark:text-sand-50">{a.label}</p>
                    <p className="text-sm text-ocean-600 dark:text-sand-200">{a.address_text}</p>
                    <p className="mt-1 text-xs text-ocean-500">
                      Alerts: {subs.length > 0 ? subs.map((s) => s.channel).join(", ") : "none"}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6">
          <AlertSignupForm />
        </div>
      </div>
    </div>
  );
}
