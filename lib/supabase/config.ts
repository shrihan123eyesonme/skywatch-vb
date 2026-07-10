// Deliberately has no "use client" / "use server" directive so it's safe to
// import from anywhere: client components, server components, route
// handlers, and proxy.ts (which runs in the Edge runtime and rejects
// imports from "use client"-marked modules).
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
