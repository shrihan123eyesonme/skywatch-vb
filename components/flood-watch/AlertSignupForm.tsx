"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";

export function AlertSignupForm() {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(configured);
  const [label, setLabel] = useState("Home");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [channels, setChannels] = useState<{ email: boolean; sms: boolean }>({
    email: true,
    sms: false,
  });
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
    return <ConnectSupabaseBanner feature="flood alert signups" />;
  }

  if (checkingAuth) {
    return <Card>Checking your account…</Card>;
  }

  if (!user) {
    return (
      <Card>
        <p className="font-semibold text-ocean-800 dark:text-sand-50">
          Create a free account to turn on alerts
        </p>
        <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">
          We tie alerts to an account so we know where to send them and let you turn
          them off anytime.
        </p>
        <LinkButton href="/signup" className="mt-4">
          Create account
        </LinkButton>
      </Card>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (address.trim().length < 3) {
      setError("Enter the address you'd like alerts for.");
      return;
    }
    if (!channels.email && !channels.sms) {
      setError("Pick at least one way to be notified.");
      return;
    }
    if (channels.sms && phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid phone number to receive text alerts.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);
      const geo = await geoRes.json();
      if (!geoRes.ok) {
        setError(geo.error ?? "We couldn't find that address.");
        return;
      }

      const supabase = createClient();
      if (!supabase || !user) return;

      if (channels.sms) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ phone_number: phone })
          .eq("id", user.id);
        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      const { data: savedAddress, error: addressError } = await supabase
        .from("saved_addresses")
        .insert({
          user_id: user.id,
          label,
          address_text: geo.displayName,
          lat: geo.lat,
          lng: geo.lng,
        })
        .select()
        .single();

      if (addressError || !savedAddress) {
        setError(addressError?.message ?? "Couldn't save that address. Try again.");
        return;
      }

      const rows = [];
      if (channels.email) rows.push({ user_id: user.id, saved_address_id: savedAddress.id, channel: "email" });
      if (channels.sms) rows.push({ user_id: user.id, saved_address_id: savedAddress.id, channel: "sms" });

      const { error: subError } = await supabase.from("alert_subscriptions").insert(rows);
      if (subError) {
        setError(subError.message);
        return;
      }

      setSuccess(true);
      setAddress("");
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card>
        <p className="font-semibold text-risk-low dark:text-[#5cc98a]">You&apos;re set up for alerts.</p>
        <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">
          Manage or turn off alerts anytime from{" "}
          <a href="/account" className="underline">
            My Account
          </a>
          .
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="alert-label" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
            Label
          </label>
          <input
            id="alert-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
            placeholder="Home"
          />
        </div>
        <div>
          <label htmlFor="alert-address" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
            Address
          </label>
          <input
            id="alert-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
            placeholder="123 Main St, Virginia Beach"
          />
        </div>
        <fieldset className="flex gap-6">
          <legend className="mb-1 text-sm font-medium text-ocean-700 dark:text-sand-100">
            Notify me by
          </legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={channels.email}
              onChange={(e) => setChannels((c) => ({ ...c, email: e.target.checked }))}
            />
            Email
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={channels.sms}
              onChange={(e) => setChannels((c) => ({ ...c, sms: e.target.checked }))}
            />
            Text message
          </label>
        </fieldset>
        {channels.sms && (
          <div>
            <label htmlFor="alert-phone" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
              Phone number
            </label>
            <input
              id="alert-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
              placeholder="(757) 555-0100"
            />
            <p className="mt-2 text-xs text-ocean-600 dark:text-sand-300">
              By providing your number, you agree to receive automated flood-risk texts
              here. Message and data rates may apply, frequency varies with conditions.
              Reply STOP to cancel anytime.
            </p>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm font-medium text-risk-high dark:text-[#e8895f]">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Saving…" : "Turn on alerts"}
        </Button>
        <p className="text-xs text-ocean-600 dark:text-sand-300">
          By continuing you agree to our{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>
          .
        </p>
      </form>
    </Card>
  );
}
