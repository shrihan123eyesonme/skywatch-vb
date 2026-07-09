// Service-role Supabase client for trusted server-only contexts (the alert
// cron job). This bypasses Row Level Security, so it must never be imported
// into client components or exposed to the browser.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function createAdminClient() {
  if (!isAdminConfigured()) return null;
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
