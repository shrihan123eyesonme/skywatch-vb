import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google/Apple (and any future OAuth provider) redirect back here with a
// `code` param after the user approves sign-in. We exchange it for a
// session, which the server client stores in cookies, then send them on.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
