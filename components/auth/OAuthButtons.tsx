"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.62H1.28A11.97 11.97 0 000 12c0 1.93.46 3.76 1.28 5.38l3.99-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.62l3.99 3.11C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.13-1.26 2.97-.9.9-2 1.42-3.16 1.33-.13-1.1.42-2.24 1.24-3.03.87-.87 2.11-1.46 3.18-1.27zm3.6 16.83c-.5 1.15-.74 1.66-1.38 2.68-.9 1.42-2.17 3.2-3.75 3.21-1.4.02-1.76-.9-3.65-.89-1.89.01-2.29.9-3.7.88-1.57-.02-2.77-1.62-3.67-3.03C1.09 17.3.28 12.94 1.6 10.02c.75-1.65 2.13-2.7 3.7-2.72 1.42-.02 2.35.94 3.63.94 1.28 0 2.06-.94 3.68-.9 1.02.03 3.06.4 4.35 2.34-.11.07-2.6 1.5-2.57 4.5.03 3.55 3.14 4.73 3.6 4.94z" />
    </svg>
  );
}

const PROVIDERS: { id: Provider; label: string; icon: () => React.ReactElement }[] = [
  { id: "google", label: "Continue with Google", icon: GoogleIcon },
  { id: "apple", label: "Continue with Apple", icon: AppleIcon },
];

export function OAuthButtons() {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(provider: Provider) {
    setLoading(provider);
    setError(null);
    const supabase = createClient();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(null);
    }
    // On success, the browser navigates away to the provider — no further
    // client-side state to set.
  }

  return (
    <div className="flex flex-col gap-2">
      {PROVIDERS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleClick(id)}
          disabled={loading !== null}
          className="flex items-center justify-center gap-3 rounded-full border border-ocean-200 bg-white px-5 py-3 text-sm font-semibold text-ocean-800 transition-colors hover:bg-sand-50 disabled:opacity-50 dark:border-ocean-600 dark:bg-ocean-700 dark:text-sand-50 dark:hover:bg-ocean-600"
        >
          <Icon />
          {loading === id ? "Redirecting…" : label}
        </button>
      ))}
      {error && (
        <p role="alert" className="text-sm font-medium text-risk-high dark:text-[#e8895f]">
          {error}
        </p>
      )}
    </div>
  );
}
