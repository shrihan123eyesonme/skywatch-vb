import { Card } from "./Card";

export function ConnectSupabaseBanner({ feature }: { feature: string }) {
  return (
    <Card className="!border-sand-300 !bg-sand-100/80 dark:!bg-ocean-700/60">
      <p className="font-semibold text-ocean-800 dark:text-sand-50">
        Connect Supabase to enable {feature}
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ocean-700 dark:text-sand-100">
        <li>
          Create a free project at{" "}
          <a href="https://supabase.com" className="underline">
            supabase.com
          </a>{" "}
          (about 2 minutes, no credit card).
        </li>
        <li>
          Run the migration in <code>supabase/migrations/0001_init.sql</code> against
          your new project (SQL Editor → paste → Run).
        </li>
        <li>
          Copy your Project URL and anon public key from Project Settings → API into{" "}
          <code>.env.local</code> (see <code>.env.local.example</code>).
        </li>
        <li>Restart the dev server.</li>
      </ol>
    </Card>
  );
}
