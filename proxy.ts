import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// The old Vercel-provided URL, now superseded by the custom domain. Redirect
// it (not other *.vercel.app hosts — that would break preview deployments)
// so search engines consolidate ranking onto one canonical URL instead of
// treating the two as duplicate content.
const LEGACY_HOST = "skywatch-vb.vercel.app";
const CANONICAL_HOST = "skywatchvb.org";

// Refreshes the Supabase auth session on every request. Without this,
// sessions can expire mid-visit — the browser client alone doesn't get a
// chance to refresh tokens for server-rendered pages. Standard @supabase/ssr
// pattern for the Next.js App Router.
export async function proxy(request: NextRequest) {
  // Google's ownership-verification file for the old property must keep
  // resolving directly on the legacy host, unredirected — otherwise Search
  // Console's periodic reverification fails and the old property loses its
  // verified status, which would block using its Change of Address tool.
  const isVerificationFile = /^\/google[a-f0-9]+\.html$/.test(request.nextUrl.pathname);

  if (request.nextUrl.hostname === LEGACY_HOST && !isVerificationFile) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
