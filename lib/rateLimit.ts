import { NextRequest } from "next/server";

// In-memory fixed-window rate limiter. Good enough for a single-instance
// deploy or an MVP's traffic level, but it resets on cold start and doesn't
// share state across serverless instances — at real scale, swap this for
// Upstash Redis (@upstash/ratelimit) with no other code changes needed
// (same `checkRateLimit` call site, different implementation underneath).

const WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; windowStart: number }>();

// Periodically forget stale buckets so this doesn't grow unbounded on a
// long-lived server.
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS * 5;
  for (const [key, bucket] of buckets) {
    if (bucket.windowStart < cutoff) buckets.delete(key);
  }
}, WINDOW_MS * 5).unref?.();

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Returns true if the request should be allowed, false if it's over the limit. */
export function checkRateLimit(key: string, limitPerMinute: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (bucket.count >= limitPerMinute) {
    return false;
  }

  bucket.count++;
  return true;
}
