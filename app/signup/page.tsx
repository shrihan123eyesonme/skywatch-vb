"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConnectSupabaseBanner } from "@/components/ui/ConnectSupabaseBanner";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-ocean-800 dark:text-sand-50">Create account</h1>
        <div className="mt-6">
          <ConnectSupabaseBanner feature="account creation" />
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase!.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-ocean-800 dark:text-sand-50">Almost there</h1>
        <Card className="mt-6">
          <p className="text-ocean-700 dark:text-sand-100">
            Check your email to confirm your account, then{" "}
            <Link href="/login" className="font-semibold underline">
              log in
            </Link>
            .
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-ocean-800 dark:text-sand-50">Create account</h1>
      <Card className="mt-6">
        <OAuthButtons />
        <div className="my-5 flex items-center gap-3 text-xs font-medium text-ocean-500">
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-600" />
          OR
          <div className="h-px flex-1 bg-ocean-100 dark:bg-ocean-600" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-ocean-700 dark:text-sand-100">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-4 py-2 dark:bg-ocean-700 dark:border-ocean-600"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-risk-high dark:text-[#e8895f]">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Card>
      <p className="mt-4 text-sm text-ocean-600 dark:text-sand-200">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
