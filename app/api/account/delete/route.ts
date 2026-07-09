import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

// Deleting an auth.users row isn't something a user's own (anon-key) client
// can do — Supabase requires the service-role admin API for that. So this
// route verifies who's asking using their own session cookie, then performs
// the deletion server-side with the admin client. Cascades (via `on delete
// cascade` in the schema) remove their profile, saved addresses, and alert
// subscriptions automatically.
export async function POST() {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Account deletion isn't configured yet (missing SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 501 }
    );
  }

  const serverClient = await createServerClient();
  const { data } = (await serverClient?.auth.getUser()) ?? { data: { user: null } };
  const user = data.user;

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const admin = createAdminClient()!;
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
